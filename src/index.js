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
  const repoName = process.env.GITHUB_ACTION_REPOSITORY
  const repoOrg = repoName.split('/')[0]

  if (repoOrg != 'nearform-actions') {
    core.warning(
      `'${repoOrg}' is no longer a valid organisation for this action.` +
        `Please update it to be under the 'nearform-actions' organisation.`
    )
  }
}

module.exports = {
  logActionRefWarning,
  logRepoWarning
}
