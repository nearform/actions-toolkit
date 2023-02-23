'use strict'

const core = require('@actions/core')

/**
 * Displays warning message if the action reference is pinned to master/main
 */
function logActionRefWarning() {
  const actionRef = process.env.GITHUB_ACTION_REF
  const repoName = process.env.GITHUB_ACTION_REPOSITORY

  if (actionRef === 'main' || actionRef === 'master') {
    core.warning(
      `${repoName} is pinned at HEAD. We strongly ` +
        `advise against pinning to "@${actionRef}" as it may be unstable. Please ` +
        `update your GitHub Action YAML from:\n\n` +
        `    uses: '${repoName}@${actionRef}'\n\n` +
        `to:\n\n` +
        `    uses: '${repoName}@<release/tag version>'\n\n` +
        `Alternatively, you can pin to any git tag or git SHA in the ` +
        `repository.`
    )
  }
}

/**
 * Displays warning message if the repository is under the nearform organisation
 */
function logRepoWarning() {
  const actionRepo = process.env.GITHUB_ACTION_REPOSITORY
  const [repoOrg, repoName] = actionRepo.split('/')
  const newOrg = 'nearform-actions'

  if (repoOrg != newOrg) {
    core.warning(
      `The '${repoName}' action, no longer exists under the '${repoOrg}' organisation.\n` +
        `Please update it to '${newOrg}', you can do this\n` +
        `by updating your Github Workflow file from:\n\n` +
        `    uses: '${repoOrg}/${repoName}'\n\n` +
        `to:\n\n` +
        `    uses: '${newOrg}/${repoName}'\n\n`
    )
  }
}

module.exports = {
  logActionRefWarning,
  logRepoWarning
}
