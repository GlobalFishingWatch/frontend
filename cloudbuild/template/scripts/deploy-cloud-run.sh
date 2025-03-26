#!/usr/bin/env bash
LOCATION=${LOCATION:-"us-central1"}
SHORT_ENV=${SHORT_ENV:-"dev"}
AFFECTED_APPS=(`cat affected-apps.txt`)
echo "Going to trigger builds for the following apps in environment: ${SHORT_ENV}"
printf '%s\n' "${AFFECTED_APPS[@]//,/}"
FAILED_APPS=()
for i in ${AFFECTED_APPS[@]//,/}; do
  if [ ! -z "$i" ]; then
    if gcloud -q beta builds triggers run --region={LOCATION} --branch=develop ui-${i}-${SHORT_ENV} 2> >(error=$(cat)); then
      echo "✅ Successfully triggered build for ui-${i}-${SHORT_ENV}"
    else
      echo "❌ Failed to trigger build for ui-${i}-${SHORT_ENV}: $error"
      FAILED_APPS+=("$i")
    fi
  fi
done

if [ ${#FAILED_APPS[@]} -ne 0 ]; then
  exit 1
fi
