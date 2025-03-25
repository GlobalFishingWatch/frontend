#!/bin/bash
# Fetch develop branch to ensure it exists
git fetch origin develop

# Get affected projects
yarn nx show projects --affected --type app # Needed to run with previous logs that were causing errors
yarn nx show projects --affected --base=origin/develop~1 --exclude='linting,port-labeler,real-time-prototype,*-e2e,libs/*' --plain > affected-apps.txt