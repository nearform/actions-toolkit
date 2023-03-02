'use strict'

const core = require('@actions/core')
const newOrg = 'nearform-actions'
const oldOrg = 'nearform'

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
  const actionPath = process.env.GITHUB_ACTION_PATH

  // Handle composite actions
  if (actionPath && actionPath.includes('/nearform/')) {
    const [actionRepoName, actionRepoVersion] = actionPath
      .split('/nearform/')[1]
      .split('/')

    return warning(actionRepoName, actionRepoVersion)
  }

  const [repoOrg, repoName] = actionRepo.split('/')

  if (repoOrg === oldOrg) {
    return warning(repoName)
  }
}

/**
 * Simple function to avoid the repetition of the message
 */
function warning(repoName, repoVersion) {
  const nameWithVersion = repoVersion ? `${repoName}@${repoVersion}` : repoName
  return core.warning(
    `The '${repoName}' action, no longer exists under the '${oldOrg}' organisation.\n` +
      `Please update it to '${newOrg}', you can do this\n` +
      `by updating your Github Workflow file from:\n\n` +
      `    uses: '${oldOrg}/${nameWithVersion}'\n\n` +
      `to:\n\n` +
      `    uses: '${newOrg}/${nameWithVersion}'\n\n`
  )
}

module.exports = {
  logActionRefWarning,
  logRepoWarning
}
