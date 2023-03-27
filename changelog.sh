#!/bin/sh
# Generate a Markdown change log of pull requests from commits between two tags
# Author: Russell Heimlich
# URL: https://gist.github.com/kingkool68/09a201a35c83e43af08fcbacee5c315a

# HOW TO USE
# Copy this script to a directory under Git version control
# Make the script executable i.e. chmod +x changelog.sh
# Run it! ./changelog.sh
# Check CHANGELOG.md to see your results

# Repo URL to base links off of
REPOSITORY_URL=https://github.com/GlobalFishingWatch/frontend
GITHUB_API_URL=https://api.github.com/repos/GlobalFishingWatch/frontend

PACKAGE_VERSION=$(grep '"version": ' apps/$1/package.json)
CURRENT_PACKAGE_VERSION=`grep -Eo '[0-9]+\.[0-9]+\.[0-9]+' <<< "$PACKAGE_VERSION"`
APP_NAME=$1

TAG_PREFIX="@globalfishingwatchapp/$1@"

# Get a list of all tags in reverse order
# Assumes the tags are in version format like v1.2.3
GIT_TAGS=$(git tag -l --sort=-version:refname | grep $TAG_PREFIX)

# Make the tags an array
TAGS=($GIT_TAGS)

LATEST_VERSION_RELEASED=$(grep -Eo '[0-9]+\.[0-9]+\.[0-9]+\.?[0-9]*' <<< ${TAGS[0]})
echo Latest Version Released: ${LATEST_VERSION_RELEASED}
echo Current Package Version: ${CURRENT_PACKAGE_VERSION}

read -p "Enter the version number [$CURRENT_PACKAGE_VERSION]: " new_version
new_version=${new_version:-${CURRENT_PACKAGE_VERSION}}

NEW_PACKAGE_VERSION="$TAG_PREFIX$new_version"


# LATEST_TAG=${TAGS[0]}
# latest commit
LATEST_TAG=`git log -n1 HEAD --format=format:"%H"`
PREVIOUS_TAG=${TAGS[0]}

# If you want to specify your own two tags to compare, uncomment and enter them below
# LATEST_TAG=v0.23.1
# PREVIOUS_TAG=v0.22.0

# Get a log of commits that occured between two tags
# We only get the commit hash so we don't have to deal with a bunch of ugly parsing
# See Pretty format placeholders at https://git-scm.com/docs/pretty-formats
COMMITS=$(git log $PREVIOUS_TAG..$LATEST_TAG --pretty=format:"%H")

# Store our changelog in a variable to be saved to a file at the end
MARKDOWN=\
"
$NEW_PACKAGE_VERSION

$2 $new_version

## What's Changed
"
OTHER_PRS=""

# Default github auth is none
GH_AUTH='none'
# When github personal access token is defined authenticate on github request
if [[ $GH_PAT ]]; then
  echo "Authenticating on Github with Personal Access Token using \$GH_PAT"
  IS_AUTHENTICATED=$(curl --fail -s \
    -H "Accept: application/vnd.github+json" \
    -H "Authorization: Bearer $GH_PAT" \
    https://api.github.com/octocat)

  if [[ $IS_AUTHENTICATED ]]; then
    echo "✅ Successful!"
    GH_AUTH="Bearer $GH_PAT"
  else
    echo "⛔️ Failed"
    echo "Review the token stored in yout GH_PAT variable, it might be expired in github. "
    echo "You can manage your Personal Access Tokens on https://github.com/settings/tokens?type=beta"
  fi
fi

# Loop over each commit and look for merged pull requests
for COMMIT in $COMMITS; do
	# Get the subject of the current commit
	SUBJECT=$(git log -1 ${COMMIT} --pretty=format:"%s")

	# If the subject contains "Merge pull request #xxxxx" then it is deemed a pull request
	PULL_REQUEST=$( grep -Eo "Merge pull request #[[:digit:]]+" <<< "$SUBJECT" )
  # Get the body of the commit
  BODY=$(git log -1 ${COMMIT} --pretty=format:"%b")
  # exclude automatic PRs (version packages, crowdin translations, etc...)
	BODY=$( grep -vEo "Version Packages|New Crowdin updates" <<< "$BODY" )
	if [[ $PULL_REQUEST && $BODY ]]; then
		# Perform a substring operation so we're left with just the digits of the pull request
		PULL_NUM=${PULL_REQUEST#"Merge pull request #"}

    # If the PR contains the app label then include it in the
    IS_APP_PR=$(curl --fail -s \
      -H "Accept: application/vnd.github+json" \
      -H "Authorization: $GH_AUTH" \
      $GITHUB_API_URL/issues/$PULL_NUM/labels \
      | grep -o '"name": "'$APP_NAME'"')

    if [[ $IS_APP_PR ]]; then
      # AUTHOR_USERNAME=$(git log -1 ${COMMIT} --pretty=format:"%aN")
      # AUTHOR_NAME=$(git log -1 ${COMMIT} --pretty=format:"%an")
      # AUTHOR_EMAIL=$(git log -1 ${COMMIT} --pretty=format:"%ae")

      MARKDOWN+='\n'
      MARKDOWN+=" - [#$PULL_NUM]($REPOSITORY_URL/pull/$PULL_NUM): $BODY"
      # Outputs:
      #  * [#1017](https://github.com/GlobalFishingWatch/frontend/pull/1017): VV-296 Fixed Downshift is not showing correct selection

      # MARKDOWN+=" - $BODY in $REPOSITORY_URL/pull/$PULL_NUM"
      # Outputs:
      # * Temporalgrid timechunks by @nerik in https://github.com/GlobalFishingWatch/frontend/pull/42
    else
      OTHER_PRS+='\n'
      OTHER_PRS+=" - [#$PULL_NUM]($REPOSITORY_URL/pull/$PULL_NUM): $BODY"
    fi
	fi
done
MARKDOWN+='\n\n'
MARKDOWN+="**Full Changelog**: $REPOSITORY_URL/compare/$PREVIOUS_TAG...$NEW_PACKAGE_VERSION"
MARKDOWN+='\n\n'
MARKDOWN+="## Other changes not labeled with '$APP_NAME':"
MARKDOWN+='\n'
MARKDOWN+=$OTHER_PRS

# Output the markdown
echo "$MARKDOWN\n\n"
