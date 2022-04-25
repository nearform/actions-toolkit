'use strict'

const { test } = require('tap')
const proxyquire = require('proxyquire')
const sinon = require('sinon')

const setup = () => {
  const warningStub = sinon.stub()

  const toolkit = proxyquire('../src/index', {
    '@actions/core': {
      warning: warningStub
    }
  })

  return { toolkit, warningStub }
}

test('should return warning if actionRef is master', async ({ teardown }) => {
  teardown(() => {
    process.env.GITHUB_ACTION_REF = undefined
    process.env.GITHUB_REPOSITORY = undefined
  })

  const { toolkit, warningStub } = setup()

  process.env.GITHUB_ACTION_REF = 'master'
  process.env.GITHUB_REPOSITORY = 'nearform/test-repo'
  toolkit.logActionRefWarning()

  sinon.assert.calledOnceWithMatch(
    warningStub,
    /nearform\/test-repo is pinned at HEAD/
  )
})

test('should return warning if actionRef is main', async ({ teardown }) => {
  teardown(() => {
    process.env.GITHUB_ACTION_REF = undefined
    process.env.GITHUB_REPOSITORY = undefined
  })

  const { toolkit, warningStub } = setup()

  process.env.GITHUB_ACTION_REF = 'main'
  process.env.GITHUB_REPOSITORY = 'nearform/test-repo'
  toolkit.logActionRefWarning()

  sinon.assert.calledOnceWithMatch(
    warningStub,
    /nearform\/test-repo is pinned at HEAD/
  )
})

test('should not print warning if actionRef is not main or master', async ({
  teardown
}) => {
  teardown(() => {
    process.env.GITHUB_ACTION_REF = undefined
    process.env.GITHUB_REPOSITORY = undefined
  })

  const { toolkit, warningStub } = setup()

  process.env.GITHUB_ACTION_REF = 'feat-test'
  process.env.GITHUB_REPOSITORY = 'nearform/test-repo'
  toolkit.logActionRefWarning()

  sinon.assert.notCalled(warningStub)
})
