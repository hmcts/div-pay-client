#!groovy

@Library('Divorce') _

buildNode {
  checkoutRepo()

  try {
    make 'install', name: 'Install dependencies'
    make 'test', name: 'Test'

    stage('Sonar scanner') {
      onPR {
        make 'sonar-scan-pr', name: 'Sonar Scan'
      }

      onMaster {
        make 'sonar-scan', name: 'Sonar Scan'
      }
    }

  } finally {
    make 'clean'
  }

  onPR {
    enforceVersionBump()
  }

  onMaster {
    publishNodePackage()
  }
}
