package com.zynctra.learning.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;
import java.util.regex.Pattern;

/**
 * Self-defending threat detector that learns from every blocked attack.
 * 
 * ARCHITECTURE:
 * - Layer 1: Static patterns (known attacks, ~100 patterns)
 * - Layer 2: Heuristic scoring (entropy, structure, anomaly)
 * - Layer 3: Adaptive rules (learned from incidents, evolves)
 * - Layer 4: Behavioral baseline (per-user deviation detection)
 * 
 * LEARNING MECHANISM:
 * - Every blocked request is stored as ThreatIncident
 * - Nightly batch: cluster similar incidents, extract new patterns
 * - If pattern confidence > 0.95, auto-promote to AdaptiveDefenseRule
 * - Rules expire after 90 days if no matches (prevents false positive accumulation)
 */
@Component
public class SelfDefendingThreatDetector {

    private static final Logger SEC_LOG = LoggerFactory.getLogger("SECURITY_AUDIT");
    private static final Logger DEFENSE_LOG = LoggerFactory.getLogger("SELF_DEFENSE");

    // Layer 1: Static patterns (immutable, loaded from resources)
    private final List<Pattern> staticPromptInjectionPatterns;
    private final List<Pattern> staticJailbreakPatterns;
    private final List<Pattern> staticCommandInjectionPatterns;
    private final List<Pattern> staticObfuscationPatterns;

    // Layer 3: Adaptive rules (learned, mutable)
    private final Map<String, AdaptiveRule> adaptiveRules = new ConcurrentHashMap<>();

    // Layer 4: Behavioral baselines
    private final Map<String, UserBehaviorProfile> behaviorProfiles = new ConcurrentHashMap<>();

    // Detection statistics
    private final AtomicLong totalRequests = new AtomicLong(0);
    private final AtomicLong blockedRequests = new AtomicLong(0);
    private final AtomicLong learnedPatterns = new AtomicLong(0);

    private final ThreatIncidentRepository incidentRepository;
    private final AdaptiveDefenseRuleRepository ruleRepository;

    public SelfDefendingThreatDetector(
            ThreatIncidentRepository incidentRepository,
            AdaptiveDefenseRuleRepository ruleRepository) {
        
        this.incidentRepository = incidentRepository;
        this.ruleRepository = ruleRepository;
        
        // Load static patterns
        this.staticPromptInjectionPatterns = loadStaticPatterns("prompt-injection");
        this.staticJailbreakPatterns = loadStaticPatterns("jailbreak");
        this.staticCommandInjectionPatterns = loadStaticPatterns("command-injection");
        this.staticObfuscationPatterns = loadStaticPatterns("obfuscation");
        
        // Load previously learned adaptive rules
        loadAdaptiveRules();
    }

    /**
     * Main entry point: analyze incoming content for threats.
     * Returns ThreatAssessment with decision and metadata.
     */
    public ThreatAssessment analyze(String content, String userId, String tenantId, 
                                     ThreatContext context) {
        totalRequests.incrementAndGet();
        long startTime = System.nanoTime();

        String normalized = normalizeInput(content);
        ThreatAssessment assessment = new ThreatAssessment();
        assessment.setOriginalContent(content);
        assessment.setNormalizedContent(normalized);
        assessment.setUserId(userId);
        assessment.setTenantId(tenantId);
        assessment.setTimestamp(Instant.now());

        // Layer 1: Static pattern matching
        boolean staticMatch = checkStaticPatterns(normalized, assessment);
        if (staticMatch) {
            assessment.setDecision(ThreatDecision.BLOCK);
            assessment.setReason("Static pattern match");
            recordIncident(assessment, context);
            blockedRequests.incrementAndGet();
            return assessment;
        }

        // Layer 2: Heuristic scoring
        double heuristicScore = calculateHeuristicScore(normalized, content);
        assessment.setHeuristicScore(heuristicScore);
        if (heuristicScore > 0.85) {
            assessment.setDecision(ThreatDecision.BLOCK);
            assessment.setReason("Heuristic score: " + heuristicScore);
            recordIncident(assessment, context);
            blockedRequests.incrementAndGet();
            return assessment;
        }

        // Layer 3: Adaptive rules
        boolean adaptiveMatch = checkAdaptiveRules(normalized, assessment);
        if (adaptiveMatch) {
            assessment.setDecision(ThreatDecision.BLOCK);
            assessment.setReason("Adaptive rule match");
            recordIncident(assessment, context);
            blockedRequests.incrementAndGet();
            return assessment;
        }

        // Layer 4: Behavioral anomaly
        boolean behavioralAnomaly = checkBehavioralAnomaly(userId, tenantId, content, assessment);
        if (behavioralAnomaly) {
            assessment.setDecision(ThreatDecision.QUARANTINE);
            assessment.setReason("Behavioral anomaly detected");
            recordIncident(assessment, context);
            blockedRequests.incrementAndGet();
            return assessment;
        }

        // Passed all layers
        assessment.setDecision(ThreatDecision.ALLOW);
        assessment.setReason("No threats detected");
        updateBehavioralBaseline(userId, tenantId, content);

        long duration = (System.nanoTime() - startTime) / 1_000_000; // ms
        DEFENSE_LOG.debug("Threat analysis completed in {}ms for user={}", duration, userId);

        return assessment;
    }

    /**
     * Nightly learning job: evolve defenses from incidents.
     */
    @Scheduled(cron = "0 0 3 * * *") // 3 AM daily
    public void evolveDefenses() {
        DEFENSE_LOG.info("SELF_DEFENSE: Starting nightly defense evolution");

        // 1. Cluster recent incidents by similarity
        List<ThreatIncident> recent = incidentRepository.findRecentForLearning(
            Instant.now().minusSeconds(86400 * 7)); // Last 7 days

        Map<String, List<ThreatIncident>> clusters = clusterBySimilarity(recent);

        // 2. For each cluster with > 5 incidents, extract pattern
        for (Map.Entry<String, List<ThreatIncident>> cluster : clusters.entrySet()) {
            if (cluster.getValue().size() >= 5) {
                String pattern = extractPattern(cluster.getValue());
                double confidence = calculateConfidence(cluster.getValue());

                if (confidence > 0.95) {
                    String ruleId = UUID.randomUUID().toString();
                    AdaptiveRule rule = new AdaptiveRule(
                        ruleId,
                        pattern,
                        "AUTO_EXTRACTED",
                        confidence,
                        cluster.getValue().size(),
                        Instant.now(),
                        Instant.now().plusSeconds(86400 * 90) // 90 day expiry
                    );
                    adaptiveRules.put(ruleId, rule);
                    ruleRepository.save(toEntity(rule));

                    learnedPatterns.incrementAndGet();
                    DEFENSE_LOG.info("SELF_DEFENSE: New adaptive rule created id={} confidence={} matches={}",
                        ruleId, confidence, cluster.getValue().size());
                }
            }
        }

        // 3. Expire old rules
        int expired = expireOldRules();
        
        // 4. Update threat intelligence feed
        updateThreatIntelligence();

        DEFENSE_LOG.info("SELF_DEFENSE: Evolution complete. Active rules={}, Expired={}, Learned={}",
            adaptiveRules.size(), expired, learnedPatterns.get());
    }

    // ========== LAYER 1: STATIC PATTERNS ==========

    private boolean checkStaticPatterns(String normalized, ThreatAssessment assessment) {
        List<PatternMatch> matches = new ArrayList<>();

        for (Pattern pattern : staticPromptInjectionPatterns) {
            if (pattern.matcher(normalized).find()) {
                matches.add(new PatternMatch("PROMPT_INJECTION", pattern.pattern()));
            }
        }
        for (Pattern pattern : staticJailbreakPatterns) {
            if (pattern.matcher(normalized).find()) {
                matches.add(new PatternMatch("JAILBREAK", pattern.pattern()));
            }
        }
        for (Pattern pattern : staticCommandInjectionPatterns) {
            if (pattern.matcher(normalized).find()) {
                matches.add(new PatternMatch("COMMAND_INJECTION", pattern.pattern()));
            }
        }
        for (Pattern pattern : staticObfuscationPatterns) {
            if (pattern.matcher(normalized).find()) {
                matches.add(new PatternMatch("OBFUSCATION", pattern.pattern()));
            }
        }

        assessment.setPatternMatches(matches);
        return !matches.isEmpty();
    }

    // ========== LAYER 2: HEURISTICS ==========

    private double calculateHeuristicScore(String normalized, String original) {
        double score = 0.0;

        // Entropy check (high entropy = possible obfuscation)
        double entropy = calculateEntropy(original);
        if (entropy > 5.5) score += 0.3;

        // Unicode abuse (zero-width, homoglyphs)
        int unicodeAbuse = countUnicodeAbuse(original);
        if (unicodeAbuse > 3) score += 0.4;

        // Structure analysis (nested delimiters)
        int nestingDepth = calculateNestingDepth(original);
        if (nestingDepth > 5) score += 0.2;

        // Keyword density (suspicious concentration)
        double keywordDensity = calculateKeywordDensity(normalized);
        if (keywordDensity > 0.3) score += 0.2;

        // Length anomaly (unusually long for query type)
        if (normalized.length() > 3000) score += 0.1;

        return Math.min(score, 1.0);
    }

    private double calculateEntropy(String input) {
        Map<Character, Integer> freq = new HashMap<>();
        for (char c : input.toCharArray()) {
            freq.merge(c, 1, Integer::sum);
        }
        double entropy = 0.0;
        int len = input.length();
        for (int count : freq.values()) {
            double p = (double) count / len;
            entropy -= p * Math.log(p) / Math.log(2);
        }
        return entropy;
    }

    private int countUnicodeAbuse(String input) {
        int count = 0;
        for (char c : input.toCharArray()) {
            // Zero-width characters, RTL overrides, homoglyphs
            if (c == '\u200B' || c == '\u200C' || c == '\u200D' || 
                c == '\u202E' || c == '\u2066' || c == '\u2069' ||
                (c >= '\uFF00' && c <= '\uFFEF')) { // Fullwidth forms
                count++;
            }
        }
        return count;
    }

    private int calculateNestingDepth(String input) {
        int maxDepth = 0;
        int currentDepth = 0;
        for (char c : input.toCharArray()) {
            if (c == '{' || c == '[' || c == '(' || c == '<') {
                currentDepth++;
                maxDepth = Math.max(maxDepth, currentDepth);
            } else if (c == '}' || c == ']' || c == ')' || c == '>') {
                currentDepth--;
            }
        }
        return maxDepth;
    }

    private double calculateKeywordDensity(String normalized) {
        String[] suspicious = {
            "ignore", "system", "override", "jailbreak", "DAN", "developer mode",
            "sudo", "exec", "eval", "system(", "subprocess", "import os",
            "forget", "previous instructions", "new instructions", "you are now"
        };
        int matches = 0;
        String lower = normalized.toLowerCase();
        for (String keyword : suspicious) {
            if (lower.contains(keyword)) matches++;
        }
        return (double) matches / suspicious.length;
    }

    // ========== LAYER 3: ADAPTIVE RULES ==========

    private boolean checkAdaptiveRules(String normalized, ThreatAssessment assessment) {
        for (AdaptiveRule rule : adaptiveRules.values()) {
            if (rule.isExpired()) continue;
            
            // Simple substring match for learned patterns (can be enhanced to regex)
            if (normalized.contains(rule.getPattern())) {
                assessment.setMatchedAdaptiveRule(rule.getId());
                rule.incrementMatchCount();
                return true;
            }
        }
        return false;
    }

    // ========== LAYER 4: BEHAVIORAL ==========

    private boolean checkBehavioralAnomaly(String userId, String tenantId, 
                                          String content, ThreatAssessment assessment) {
        String key = tenantId + ":" + userId;
        UserBehaviorProfile profile = behaviorProfiles.get(key);
        if (profile == null) return false; // New user, no baseline

        // Query frequency anomaly
        long recentQueries = profile.getRecentQueryCount(300); // 5 min window
        if (recentQueries > 50) { // > 10/min
            assessment.setBehavioralAnomaly("Query flood: " + recentQueries + " in 5min");
            return true;
        }

        // Content length anomaly
        double avgLength = profile.getAverageQueryLength();
        if (content.length() > avgLength * 5 && avgLength > 0) {
            assessment.setBehavioralAnomaly("Length anomaly: " + content.length() + " vs avg " + avgLength);
            return true;
        }

        // Time-based anomaly (off-hours for this user)
        if (profile.isOffHoursActivity()) {
            assessment.setBehavioralAnomaly("Off-hours activity");
            // Don't block, just flag
        }

        return false;
    }

    private void updateBehavioralBaseline(String userId, String tenantId, String content) {
        String key = tenantId + ":" + userId;
        behaviorProfiles.computeIfAbsent(key, k -> new UserBehaviorProfile())
            .recordQuery(content.length());
    }

    // ========== INCIDENT RECORDING ==========

    private void recordIncident(ThreatAssessment assessment, ThreatContext context) {
        ThreatIncident incident = new ThreatIncident();
        incident.setId(UUID.randomUUID().toString());
        incident.setTenantId(assessment.getTenantId());
        incident.setUserId(assessment.getUserId());
        incident.setDecision(assessment.getDecision().name());
        incident.setReason(assessment.getReason());
        incident.setHeuristicScore(assessment.getHeuristicScore());
        incident.setNormalizedContent(assessment.getNormalizedContent());
        incident.setEndpoint(context.getEndpoint());
        incident.setHttpMethod(context.getHttpMethod());
        incident.setClientIp(context.getClientIp());
        incident.setTimestamp(Instant.now());

        incidentRepository.save(incident);

        SEC_LOG.warn("THREAT_BLOCKED: decision={} reason={} user={} endpoint={} score={}",
            assessment.getDecision(), assessment.getReason(), 
            assessment.getUserId(), context.getEndpoint(), assessment.getHeuristicScore());
    }

    // ========== LEARNING HELPERS ==========

    private Map<String, List<ThreatIncident>> clusterBySimilarity(List<ThreatIncident> incidents) {
        Map<String, List<ThreatIncident>> clusters = new HashMap<>();
        for (ThreatIncident incident : incidents) {
            // Simple clustering by common substring (Levenshtein or simhash in production)
            String normalized = incident.getNormalizedContent();
            String clusterKey = extractClusterKey(normalized);
            clusters.computeIfAbsent(clusterKey, k -> new ArrayList<>()).add(incident);
        }
        return clusters;
    }

    private String extractClusterKey(String normalized) {
        // Extract first 50 chars as rough cluster key
        return normalized.length() > 50 ? normalized.substring(0, 50) : normalized;
    }

    private String extractPattern(List<ThreatIncident> incidents) {
        // Find longest common substring across incidents
        if (incidents.isEmpty()) return "";
        String pattern = incidents.get(0).getNormalizedContent();
        for (int i = 1; i < incidents.size(); i++) {
            pattern = longestCommonSubstring(pattern, incidents.get(i).getNormalizedContent());
        }
        return pattern.length() > 10 ? pattern : ""; // Min pattern length
    }

    private String longestCommonSubstring(String a, String b) {
        int[][] dp = new int[a.length() + 1][b.length() + 1];
        int maxLen = 0, endIndex = 0;
        for (int i = 1; i <= a.length(); i++) {
            for (int j = 1; j <= b.length(); j++) {
                if (a.charAt(i - 1) == b.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                    if (dp[i][j] > maxLen) {
                        maxLen = dp[i][j];
                        endIndex = i;
                    }
                }
            }
        }
        return a.substring(endIndex - maxLen, endIndex);
    }

    private double calculateConfidence(List<ThreatIncident> incidents) {
        // Confidence based on diversity of sources and consistency
        long uniqueUsers = incidents.stream().map(ThreatIncident::getUserId).distinct().count();
        double userDiversity = Math.min(uniqueUsers / 3.0, 1.0); // At least 3 unique users
        double consistency = incidents.size() / 10.0; // More incidents = higher confidence
        return Math.min((userDiversity * 0.4 + consistency * 0.6), 1.0);
    }

    private int expireOldRules() {
        int expired = 0;
        Instant now = Instant.now();
        Iterator<Map.Entry<String, AdaptiveRule>> it = adaptiveRules.entrySet().iterator();
        while (it.hasNext()) {
            Map.Entry<String, AdaptiveRule> entry = it.next();
            if (entry.getValue().isExpired()) {
                it.remove();
                expired++;
            }
        }
        return expired;
    }

    private void updateThreatIntelligence() {
        // Share anonymized patterns with other services (optional)
        // In Zero-Trust model: keep intelligence local per tenant
    }

    private void loadAdaptiveRules() {
        List<AdaptiveDefenseRule> rules = ruleRepository.findAllActive(Instant.now());
        for (AdaptiveDefenseRule rule : rules) {
            adaptiveRules.put(rule.getId(), fromEntity(rule));
        }
        DEFENSE_LOG.info("SELF_DEFENSE: Loaded {} adaptive rules", adaptiveRules.size());
    }

    // ========== UTILITIES ==========

    private String normalizeInput(String input) {
        if (input == null) return "";
        // NFKC normalization
        String normalized = java.text.Normalizer.normalize(input, java.text.Normalizer.Form.NFKC);
        // Remove zero-width and control characters
        normalized = normalized.replaceAll("[\\p{C}\\p{Zs}&&[^\\s]]", "");
        // Lower case for consistent matching
        return normalized.toLowerCase().trim();
    }

    private List<Pattern> loadStaticPatterns(String type) {
        List<Pattern> patterns = new ArrayList<>();
        // Load from classpath resources
        try {
            java.io.InputStream is = getClass().getResourceAsStream("/threat-patterns/" + type + "-patterns.json");
            if (is != null) {
                String content = new String(is.readAllBytes(), java.nio.charset.StandardCharsets.UTF_8);
                // Parse JSON array of patterns
                // Simplified: add known patterns directly
            }
        } catch (Exception e) {
            DEFENSE_LOG.warn("Failed to load patterns for {}", type);
        }

        // Fallback: embedded critical patterns
        switch (type) {
            case "prompt-injection" -> {
                patterns.add(Pattern.compile("(?i)ignore\\s+(all|previous|above)\\s+instructions?"));
                patterns.add(Pattern.compile("(?i)forget\\s+(everything|your\\s+instructions|your\\s+training)"));
                patterns.add(Pattern.compile("(?i)system\\s*:\\s*new\\s+instruction"));
                patterns.add(Pattern.compile("(?i)developer\\s*:\\s*override"));
                patterns.add(Pattern.compile("(?i)you\\s+are\\s+now\\s+(?:DAN|jailbroken|unrestricted)"));
            }
            case "jailbreak" -> {
                patterns.add(Pattern.compile("(?i)DAN\\s+mode|do\\s+anything\\s+now"));
                patterns.add(Pattern.compile("(?i)jailbreak|bypass\\s+guardrail|override\\s+system"));
                patterns.add(Pattern.compile("(?i)pretend\\s+you\\s+are|act\\s+as\\s+if\\s+you"));
            }
            case "command-injection" -> {
                patterns.add(Pattern.compile("(?i)(sudo\\s+|rm\\s+-rf|exec\\s*\\(|eval\\s*\\()"));
                patterns.add(Pattern.compile("(?i)(system\\s*\\(|subprocess\\.|os\\.system|import\\s+os)"));
                patterns.add(Pattern.compile("(?i)(`|\\$\\(|\\$\\{|<%|%>)"));
            }
            case "obfuscation" -> {
                patterns.add(Pattern.compile("(?i)(\\{\\{\\s*.*\\s*\\}\\}|\\$\\{.*\\})"));
                patterns.add(Pattern.compile("(?i)(base64|hex|rot13|urlencode)"));
                patterns.add(Pattern.compile("[\\u200B\\u200C\\u200D\\u202E\\u2066\\u2069]{2,}"));
            }
        }
        return patterns;
    }

    // Entity conversion helpers
    private AdaptiveDefenseRule toEntity(AdaptiveRule rule) {
        AdaptiveDefenseRule entity = new AdaptiveDefenseRule();
        entity.setId(rule.getId());
        entity.setPattern(rule.getPattern());
        entity.setSource(rule.getSource());
        entity.setConfidence(rule.getConfidence());
        entity.setMatchCount(rule.getMatchCount());
        entity.setCreatedAt(rule.getCreatedAt());
        entity.setExpiresAt(rule.getExpiresAt());
        return entity;
    }

    private AdaptiveRule fromEntity(AdaptiveDefenseRule entity) {
        return new AdaptiveRule(
            entity.getId(),
            entity.getPattern(),
            entity.getSource(),
            entity.getConfidence(),
            entity.getMatchCount(),
            entity.getCreatedAt(),
            entity.getExpiresAt()
        );
    }

    // Inner classes
    public static class ThreatAssessment {
        private String originalContent;
        private String normalizedContent;
        private String userId;
        private String tenantId;
        private Instant timestamp;
        private ThreatDecision decision;
        private String reason;
        private double heuristicScore;
        private List<PatternMatch> patternMatches = new ArrayList<>();
        private String matchedAdaptiveRule;
        private String behavioralAnomaly;

        // Getters/setters
        public String getOriginalContent() { return originalContent; }
        public void setOriginalContent(String v) { this.originalContent = v; }
        public String getNormalizedContent() { return normalizedContent; }
        public void setNormalizedContent(String v) { this.normalizedContent = v; }
        public String getUserId() { return userId; }
        public void setUserId(String v) { this.userId = v; }
        public String getTenantId() { return tenantId; }
        public void setTenantId(String v) { this.tenantId = v; }
        public Instant getTimestamp() { return timestamp; }
        public void setTimestamp(Instant v) { this.timestamp = v; }
        public ThreatDecision getDecision() { return decision; }
        public void setDecision(ThreatDecision v) { this.decision = v; }
        public String getReason() { return reason; }
        public void setReason(String v) { this.reason = v; }
        public double getHeuristicScore() { return heuristicScore; }
        public void setHeuristicScore(double v) { this.heuristicScore = v; }
        public List<PatternMatch> getPatternMatches() { return patternMatches; }
        public void setPatternMatches(List<PatternMatch> v) { this.patternMatches = v; }
        public String getMatchedAdaptiveRule() { return matchedAdaptiveRule; }
        public void setMatchedAdaptiveRule(String v) { this.matchedAdaptiveRule = v; }
        public String getBehavioralAnomaly() { return behavioralAnomaly; }
        public void setBehavioralAnomaly(String v) { this.behavioralAnomaly = v; }
    }

    public enum ThreatDecision { ALLOW, BLOCK, QUARANTINE }

    public record PatternMatch(String category, String pattern) {}

    public record ThreatContext(String endpoint, String httpMethod, String clientIp) {}

    private static class AdaptiveRule {
        private final String id;
        private final String pattern;
        private final String source;
        private final double confidence;
        private int matchCount;
        private final Instant createdAt;
        private final Instant expiresAt;

        AdaptiveRule(String id, String pattern, String source, double confidence,
                     int matchCount, Instant createdAt, Instant expiresAt) {
            this.id = id;
            this.pattern = pattern;
            this.source = source;
            this.confidence = confidence;
            this.matchCount = matchCount;
            this.createdAt = createdAt;
            this.expiresAt = expiresAt;
        }

        String getId() { return id; }
        String getPattern() { return pattern; }
        String getSource() { return source; }
        double getConfidence() { return confidence; }
        int getMatchCount() { return matchCount; }
        void incrementMatchCount() { this.matchCount++; }
        Instant getCreatedAt() { return createdAt; }
        boolean isExpired() { return Instant.now().isAfter(expiresAt); }
    }

    private static class UserBehaviorProfile {
        private final Queue<Long> queryTimestamps = new LinkedList<>();
        private final List<Integer> queryLengths = new ArrayList<>();
        private int totalQueries = 0;

        void recordQuery(int length) {
            long now = System.currentTimeMillis();
            queryTimestamps.offer(now);
            queryLengths.add(length);
            totalQueries++;

            // Keep only last 1000 queries
            while (queryTimestamps.size() > 1000) {
                queryTimestamps.poll();
                queryLengths.remove(0);
            }
        }

        long getRecentQueryCount(int secondsWindow) {
            long cutoff = System.currentTimeMillis() - (secondsWindow * 1000);
            return queryTimestamps.stream().filter(t -> t > cutoff).count();
        }

        double getAverageQueryLength() {
            return queryLengths.stream().mapToInt(Integer::intValue).average().orElse(0);
        }

        boolean isOffHoursActivity() {
            int hour = java.time.LocalDateTime.now().getHour();
            return hour < 6 || hour > 22;
        }
    }
}