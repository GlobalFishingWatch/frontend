🐵 Quick checklist when opening a PR 🐵
- Have you run **basic QA tests**?
  - Is the feature working?
  - Is the feature working under different sets of privileges?
  - Is the feature working with another workspace?
- Did you include a **description** of what this PR is about?
  - describe the feature implemented - if this PR affects an `application`
  - describe the API changes implemented - if this PR affects a `package`
- Did you include, if applicable, a **screenshot** of the feature?
- Have you linked, if applicable, the **related JIRA ticket**?

Ground rules
- **keep PRs small**
   - `applications` and `packages` can be modified in the same PR
   - you should not open a single PR for multiple features
   - you should not open a single PR for multiple `application`s
- Try to keep commit messages explicit/useful
   - avoid changing history/squashing except to rewrite commit messages
- This PR should be reviewed by at least 1 team member
- It is your responsability to merge the PR
