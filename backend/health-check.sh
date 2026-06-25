#!/bin/bash
# Zynctra Backend Health Check Script
# Run from backend directory: bash health-check.sh

echo "╔════════════════════════════════════════════════════════════╗"
echo "║     ZYNCTRA BACKEND - HEALTH CHECK SCRIPT                  ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check service
check_service() {
    local port=$1
    local service=$2
    
    if curl -s http://localhost:$port/actuator/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ ${service}${NC} (Port $port)"
        return 0
    else
        echo -e "${RED}❌ ${service}${NC} (Port $port)"
        return 1
    fi
}

# Function to check docker container
check_container() {
    local container=$1
    
    if docker ps | grep -q $container; then
        echo -e "${GREEN}✅ Docker container: $container${NC}"
        return 0
    else
        echo -e "${RED}❌ Docker container: $container${NC}"
        return 1
    fi
}

echo "🐳 DOCKER CONTAINERS:"
check_container "zynctra-postgres-auth"
check_container "zynctra-redis"
check_container "zynctra-rabbitmq"
echo ""

echo "🔧 BACKEND SERVICES:"
check_service "8000" "API Gateway"
check_service "8001" "Auth Service"
check_service "8002" "Core HR Service"
check_service "8003" "Payroll Service"
check_service "8004" "ATS Service"
check_service "8005" "Time & Attendance Service"
check_service "8006" "Analytics Service"
check_service "8007" "Performance Service"
check_service "8008" "Learning Service"
check_service "8009" "Security Admin Service"
check_service "8010" "Connector Service"
check_service "8086" "Benefits Service"
echo ""

echo "🧠 AI SERVICES (Optional):"
check_service "5001" "Analytics AI Service" || echo -e "${YELLOW}⏭  Analytics AI (not running - optional)${NC}"
check_service "5002" "Anomaly Detector" || echo -e "${YELLOW}⏭  Anomaly Detector (not running - optional)${NC}"
check_service "5003" "NLP Assistant" || echo -e "${YELLOW}⏭  NLP Assistant (not running - optional)${NC}"
echo ""

echo "🔗 CONNECTORS (Optional):"
check_service "8080" "Connectors Service" || echo -e "${YELLOW}⏭  Connectors (not running - optional)${NC}"
echo ""

echo "💾 DATABASE CONNECTIVITY:"
if docker exec zynctra-postgres-auth pg_isready -U postgres > /dev/null 2>&1; then
    echo -e "${GREEN}✅ PostgreSQL (Auth)${NC}"
else
    echo -e "${RED}❌ PostgreSQL (Auth)${NC}"
fi

if docker exec zynctra-redis redis-cli -a zynctra-redis-password-change-in-prod ping > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Redis${NC}"
else
    echo -e "${RED}❌ Redis${NC}"
fi

if docker exec zynctra-rabbitmq rabbitmq-diagnostics -q ping > /dev/null 2>&1; then
    echo -e "${GREEN}✅ RabbitMQ${NC}"
else
    echo -e "${RED}❌ RabbitMQ${NC}"
fi

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║ Health check complete!                                    ║"
echo "╚════════════════════════════════════════════════════════════╝"
