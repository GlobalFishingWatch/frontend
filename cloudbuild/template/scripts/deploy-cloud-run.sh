#!/usr/bin/env bash
LOCATION=${LOCATION:-"us-central1"}
SHORT_ENV=${SHORT_ENV:-"dev"}
AFFECTED_APPS=(`cat affected-apps.txt`)
echo "Going to trigger builds for the following apps in environment: ${SHORT_ENV}"
printf '%s\n' "${AFFECTED_APPS[@]//,/}"
FAILED_APPS=()
for app in ${AFFECTED_APPS[@]//,/}; do
  if [ ! -z "$app" ]; then
    if output=$(gcloud -q beta builds triggers run ui-${app}-${SHORT_ENV} --region=${LOCATION} --branch=develop 2>&1); then
      echo "✅ Successfully triggered build for ui-${app}-${SHORT_ENV}"
    else
      echo "❌ Failed to trigger build for ui-${app}-${SHORT_ENV}: $output"
      FAILED_APPS+=("$app")
    fi
  fi
done

if [ ${#FAILED_APPS[@]} -ne 0 ]; then
  exit 1
fi
