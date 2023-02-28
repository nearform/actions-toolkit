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
  const action = process.env.GITHUB_ACTION

  try {
    const [repoOrg, repoName] = actionRepo.split('/')
    let parentActionOrg, parentActionRepo
    ;[, parentActionOrg] = action.match(/__(.*)_/)
    parentActionOrg = parentActionOrg.replace('_', '-')
    ;[parentActionRepo] = action.match(/([^_]+$)/)

    if (repoOrg === oldOrg || parentActionOrg === oldOrg) {
      return warning(repoOrg === oldOrg ? repoName : parentActionRepo)
    }
  } catch (e) {
    core.warning(`There was an error: ${e}`)
  }
}

/**
 * Simple function to avoid the repetition of the message
 */
function warning(repoName) {
  return core.warning(
    `The '${repoName}' action, no longer exists under the '${oldOrg}' organisation.\n` +
      `Please update it to '${newOrg}', you can do this\n` +
      `by updating your Github Workflow file from:\n\n` +
      `    uses: '${oldOrg}/${repoName}'\n\n` +
      `to:\n\n` +
      `    uses: '${newOrg}/${repoName}'\n\n`
  )
}

module.exports = {
  logActionRefWarning,
  logRepoWarning
}
