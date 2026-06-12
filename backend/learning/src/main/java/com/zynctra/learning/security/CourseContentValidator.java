package com.zynctra.learning.security;

import org.owasp.html.HtmlPolicyBuilder;
import org.owasp.html.PolicyFactory;
import org.springframework.stereotype.Component;

@Component
public class CourseContentValidator {

    private static final PolicyFactory HTML_POLICY = new HtmlPolicyBuilder()
        .allowElements("p", "br", "strong", "em", "u", "ul", "ol", "li", 
            "h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "code", "pre",
            "table", "thead", "tbody", "tr", "th", "td", "a", "img", "span", "div")
        .allowAttributes("href").onElements("a")
        .allowAttributes("src", "alt", "width", "height").onElements("img")
        .allowAttributes("class", "id").globally()
        .allowStyling()
        .allowUrlProtocols("https", "http")
        .requireRelNofollowOnLinks()
        .toFactory();

    public String sanitizeHtml(String rawHtml) {
        if (rawHtml == null) return "";
        return HTML_POLICY.sanitize(rawHtml);
    }

    public boolean isValidScormPackage(byte[] content) {
        // Check for ZIP bomb, XML bomb, script tags
        if (content.length > 100 * 1024 * 1024) return false; // 100MB max
        
        String contentStr = new String(content, 0, Math.min(content.length, 10000));
        String lower = contentStr.toLowerCase();
        
        return !lower.contains("<script") && 
               !lower.contains("javascript:") &&
               !lower.contains("<?xml") &&
               !lower.contains("<!entity") &&
               !lower.contains("<!doctype");
    }
}