#!/bin/bash

# ============================================
# Load Test Data Script
# Purpose: Load test data into TradeCraft database
# ============================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}TradeCraft Test Data Loader${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Load environment variables
if [ -f ../../.env ]; then
    echo -e "${YELLOW}Loading environment variables...${NC}"
    export $(cat ../../.env | grep -v '^#' | xargs)
else
    echo -e "${YELLOW}Warning: .env file not found, using defaults${NC}"
fi

# Database configuration with defaults
DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-5432}
DB_NAME=${DB_NAME:-tradecraft_dev}
DB_USERNAME=${DB_USERNAME:-tradecraft}
DB_PASSWORD=${DB_PASSWORD:-tradecraft123}

echo -e "${YELLOW}Database Configuration:${NC}"
echo "  Host: $DB_HOST"
echo "  Port: $DB_PORT"
echo "  Database: $DB_NAME"
echo "  Username: $DB_USERNAME"
echo ""

# Check if PostgreSQL is accessible
echo -e "${YELLOW}Checking database connection...${NC}"
if ! PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USERNAME -d $DB_NAME -c "SELECT 1;" > /dev/null 2>&1; then
    echo -e "${RED}Error: Cannot connect to database${NC}"
    echo "Please check your database configuration and ensure PostgreSQL is running."
    exit 1
fi
echo -e "${GREEN}✓ Database connection successful${NC}"
echo ""

# Confirmation prompt
echo -e "${YELLOW}WARNING: This will delete existing test data!${NC}"
echo -e "${YELLOW}Press CTRL+C to cancel, or Enter to continue...${NC}"
read

# Load test data
echo -e "${YELLOW}Loading test data...${NC}"
if PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USERNAME -d $DB_NAME -f seed-test-data.sql; then
    echo ""
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}✓ Test data loaded successfully!${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo ""
    echo -e "${YELLOW}Test Accounts:${NC}"
    echo "  Buyer 1:"
    echo "    Email: buyer1@test.com"
    echo "    Password: Test123!"
    echo ""
    echo "  Buyer 2:"
    echo "    Email: buyer2@test.com"
    echo "    Password: Test123!"
    echo ""
    echo "  Admin:"
    echo "    Email: seller@test.com"
    echo "    Password: Test123!"
    echo ""
    echo -e "${GREEN}You can now test the application with these accounts!${NC}"
else
    echo -e "${RED}Error: Failed to load test data${NC}"
    exit 1
fi
