pipeline {
    agent any

    tools {
        nodejs 'nodejs20'
        dockerTool 'docker'
    }

    environment {
        DOCKER_USERNAME = 'gchauhan1517'
        DOCKER_CREDENTIALS_ID = 'docker-hub-creds' // Must match your Jenkins credentials ID
    }

    stages {
        stage('Git Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/Gaurav1517/nextjs-app.git'
            }
        }

        // stage('Install Dependencies') {
        //     steps {
        //         sh 'npm install'
        //     }
        // }

        // stage('Build Next.js App') {
        //     steps {
        //         sh 'npm run build'
        //     }
        // }

        stage('Docker Image Build') {
            steps {
                script {
                    def JOB = env.JOB_NAME.toLowerCase()
                    sh "docker build -t ${JOB}:${BUILD_NUMBER} ."
                }
            }
        }

        stage('Docker Image Tag') {
            steps {
                script {
                    def JOB = env.JOB_NAME.toLowerCase()
                    sh "docker tag ${JOB}:${BUILD_NUMBER} ${DOCKER_USERNAME}/${JOB}:v${BUILD_NUMBER}"
                    sh "docker tag ${JOB}:${BUILD_NUMBER} ${DOCKER_USERNAME}/${JOB}:latest"
                }
            }
        }

        stage('Docker Image Push') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: "${DOCKER_CREDENTIALS_ID}", usernameVariable: 'docker_user', passwordVariable: 'docker_pass')]) {
                        sh "docker login -u '${docker_user}' -p '${docker_pass}'"
                        def JOB = env.JOB_NAME.toLowerCase()
                        sh "docker push ${docker_user}/${JOB}:v${BUILD_NUMBER}"
                        sh "docker push ${docker_user}/${JOB}:latest"
                    }
                }
            }
        }

        stage('Docker Image Cleanup') {
            steps {
                script {
                    sh "docker image prune -af"
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    // Copy k8s directory to Ansible workspace using Ansible
                    sh "cd tf/ansible && ansible-playbook -i inventory.ini playbooks/copy.yml"
                    // Run Ansible playbook to deploy
                    sh "cd tf/ansible && ansible-playbook -i inventory.ini playbooks/deploy.yml || true"
                }
            }
        }

        stage('Verify Deployment') {
            steps {
                script {
                    // Run Ansible to check deployment status
                    sh "cd tf/ansible && ansible-playbook -i inventory.ini playbooks/verify.yml || true"
                }
            }
        }
    }

    post {
        always {
            echo 'Pipeline completed.'
        }
        failure {
            echo 'Pipeline failed.'
        }
    }
}
