pipeline {
    agent any

    environment {
        // Set the environment variables for Netlify deployment
        NETLIFY_SITE_ID = '2b300bd0-5cc2-4b21-a37f-d9be4c4123e7'
        NETLIFY_AUTH_TOKEN = credentials('netlify_auth_token')
    }
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
                    bat 'npm run build'
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
        stage('Deploy to Netlify'){
            when {
                expression {
                    currentBuild.result == null || currentBuild.result == 'SUCCESS'
                }
            }

            steps {
                echo 'Deploying to Netlify...'
                    bat 'netlify deploy --prod --dir=front-end/out --site=%NETLIFY_SITE_ID% --auth=%NETLIFY_AUTH_TOKEN%'
            }
        }
    }
}
