#!groovy

@Library('Divorce') _

buildNode {
  checkoutRepo()

  try {
    sh 'yarn'
    sh 'yarn test'
  } finally {
    sh 'rm -rf node_modules'
  }

  onPR {
    enforceVersionBump()
  }

  onMaster {
    publishNodePackage()
  }
}
