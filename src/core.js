'use strict'

/**
 * Displays warning message if the action reference is pinned to master/main
 *
 * @param     repoName     Full name of the repo (owner/repo-name)
 * @return   { String }    Warning to be emitted
 */
function getActionRefWarning(repoName) {
  if (!repoName) return null

  const actionRef = process.env.GITHUB_ACTION_REF

  if (actionRef === 'main' || actionRef === 'master') {
    const warning =
      `${repoName} is pinned at HEAD. We strongly ` +
      `advise against pinning to "@master" as it may be unstable. Please ` +
      `update your GitHub Action YAML from:\n\n` +
      `    uses: '${repoName}@master'\n\n` +
      `to:\n\n` +
      `    uses: '${repoName}@<release/tag version>'\n\n` +
      `Alternatively, you can pin to any git tag or git SHA in the ` +
      `repository.`
    return warning
  }
  return null
}

module.exports = {
  getActionRefWarning
}
