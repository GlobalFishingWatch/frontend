#!/bin/bash

# Fancy colors for output
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Save the original directory
ORIGINAL_DIR=$(pwd)

# Initialize error status
ERROR_STATUS=0

# Cleanup function
cleanup() {
    echo -e "\n${RED}${BOLD}⚠️  Script interrupted! Cleaning up...${NC}"
    cd "$ORIGINAL_DIR"
    exit 1
}

# Set up trap for Ctrl+C (SIGINT) and other termination signals
trap cleanup SIGINT SIGTERM

echo -e "\n\n${MAGENTA}${BOLD}🚀 Applying main cloudbuild Terraform configuration...${NC}\n\n"
cd cloudbuild
terraform init
if [ $? -ne 0 ]; then
    echo -e "\n${RED}${BOLD}❌ Error during terraform init in main cloudbuild${NC}"
    ERROR_STATUS=1
fi

terraform apply --auto-approve
if [ $? -ne 0 ]; then
    echo -e "\n${RED}${BOLD}❌ Error during terraform apply in main cloudbuild${NC}"
    ERROR_STATUS=1
fi

# Return to the root directory
cd "$ORIGINAL_DIR"

# Find all cloudbuild directories in apps and apply their Terraform configurations
find apps/*/cloudbuild -type f -name "*.tf" -exec dirname {} \; | sort -u | while read -r dir; do
    echo -e "\n\n${YELLOW}${BOLD}⚡ Processing: ${dir}${NC}\n\n"
    cd "$dir"
    terraform init
    if [ $? -ne 0 ]; then
        echo -e "\n${RED}${BOLD}❌ Error during terraform init in ${dir}${NC}"
        ERROR_STATUS=1
    fi

    terraform apply --auto-approve
    if [ $? -ne 0 ]; then
        echo -e "\n${RED}${BOLD}❌ Error during terraform apply in ${dir}${NC}"
        ERROR_STATUS=1
    fi
    cd "$ORIGINAL_DIR"
done

# Only show success message if no errors occurred
if [ $ERROR_STATUS -eq 0 ]; then
    echo -e "\n\n${CYAN}${BOLD}✨ All Terraform configurations have been successfully applied! 🎉${NC}\n"
else
    echo -e "\n\n${RED}${BOLD}❌ Some Terraform operations failed. Please check the logs above for details.${NC}\n"
    exit 1
fi
