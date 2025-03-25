#!/usr/bin/env bash
SHORT_ENV=${SHORT_ENV:-"dev"}
AFFECTED_APPS=(`cat affected-apps.txt`)
echo "Going to trigger builds for the following apps in environment: ${SHORT_ENV}"
printf '%s\n' "${AFFECTED_APPS[@]//,/}"
FAILED_APPS=()
for i in ${AFFECTED_APPS[@]//,/}; do
  if [ ! -z "$i" ]; then
    if gcloud -q beta builds triggers run --branch=develop ui-${i}-${SHORT_ENV} 2>/dev/null; then
      echo "✅ Successfully triggered build for ui-${i}-${SHORT_ENV}"
    else
      echo "❌ Failed to trigger build for ui-${i}-${SHORT_ENV} (trigger might not exist)"
      FAILED_APPS+=("$i")
    fi
  fi
done

if [ ${#FAILED_APPS[@]} -ne 0 ]; then
  exit 1
fi
