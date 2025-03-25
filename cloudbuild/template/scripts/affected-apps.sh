#!/bin/bash
yarn nx show projects --affected --type app
yarn nx show projects --affected --base=origin/develop~1 --exclude='linting,port-labeler,real-time-prototype,*-e2e,libs/*' --plain > affected-apps.txt