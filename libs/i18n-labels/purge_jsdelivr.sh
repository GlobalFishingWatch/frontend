#!/bin/sh

find libs/i18n-labels \
  | grep -iE '.*/(en|es|pt|fr|id|val)/.*\.json' \
  | sed "s/libs\/i18n-labels/https:\/\/purge.jsdelivr.net\/npm\/@globalfishingwatch\/i18n-labels@$PACKAGE_TAG/" \
  | xargs curl
