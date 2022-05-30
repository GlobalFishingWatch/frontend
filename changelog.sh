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

PACKAGE_VERSION=$(grep '"version": ' apps/$1/package.json)
CURRENT_PACKAGE_VERSION=`grep -Eo '[0-9]+\.[0-9]+\.[0-9]+' <<< "$PACKAGE_VERSION"`

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
	fi
done
MARKDOWN+='\n\n'
MARKDOWN+="**Full Changelog**: $REPOSITORY_URL/compare/$PREVIOUS_TAG...$NEW_PACKAGE_VERSION"

# Output the markdown
echo "$MARKDOWN\n\n"
