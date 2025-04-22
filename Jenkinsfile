pipeline {
    agent any

    stages {
        stage('Checkout code') {
            steps {
                // Clean before fresh checkout
                deleteDir()
                git url: 'https://github.com/kokyeeyang/movie-booking.git', branch: 'master'
            }
        }

        stage('Install Frontend Dependencies') {
            steps {
                dir('front-end') {
                    bat 'npm install --legacy-peer-deps'
                }
            }
        }

        stage('Run Frontend Tests') {
            steps {
                dir('front-end') {
                    bat 'npm test'
                }
            }
        }

        stage('Install Backend Dependencies') {
            steps {
                dir('server') {
                    bat 'npm install --legacy-peer-deps'
                }
            }
        }

        stage('Run Backend Tests') {
            steps {
                dir('server') {
                    bat 'npm test'
                }
            }
        }
    }
}
