#!groovy

@Library('Divorce') _

buildNode {
  checkoutRepo()

  try {
    make 'install', name: 'Install dependencies'
    make 'test', name: 'Test'

    stage('Sonar scanner') {
      onPR {
        sh 'yarn sonar-scanner -Dsonar.analysis.mode=preview -Dsonar.host.url=$SONARQUBE_URL'
      }

      onMaster {
       sh 'yarn sonar-scanner -Dsonar.host.url=$SONARQUBE_URL'
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
