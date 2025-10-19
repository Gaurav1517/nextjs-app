pipeline {
    agent any

    tools {
        nodejs 'nodejs20'
        dockerTool 'docker'
    }

    environment {
        DOCKER_USERNAME = 'gchauhan1517'
        DOCKER_CREDENTIALS_ID = 'docker-hub-creds'
        EC2_IP = '192.168.44.131'
        SSH_CRED = 'ssh-key-cred'
        EC2_NAME = 'ubuntu'
    }

    stages {
        stage('Git Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/Gaurav1517/nextjs-app.git'
            }
        }

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
                        def JOB = env.JOB_NAME.toLowerCase()
                        sh "echo '${docker_pass}' | docker login -u '${docker_user}' --password-stdin"
                        sh "docker push ${docker_user}/${JOB}:v${BUILD_NUMBER}"
                        sh "docker push ${docker_user}/${JOB}:latest"
                    }
                }
            }
        }

        stage('Docker Cleanup') {
            steps {
                sh "docker image prune -af"
            }
        }
        

        stage('Deploy to Kubernetes') {
            steps {
                sshagent (credentials: ["${SSH_CRED}"]) {
                    script {
                        // Ensure 'k8s' directory exists in workspace
                        sh "ls -la k8s"

                        // Copy manifests to EC2
                        sh "scp -o StrictHostKeyChecking=no -r k8s ${EC2_NAME}@${EC2_IP}:/home/${EC2_NAME}/"

                        // Delete existing deployment (ignore errors)
                        sh "ssh -o StrictHostKeyChecking=no ${EC2_NAME}@${EC2_IP} 'kubectl delete -f /home/${EC2_NAME}/k8s/ || true'"

                        // Apply namespace first
                        sh "ssh -o StrictHostKeyChecking=no ${EC2_NAME}@${EC2_IP} 'kubectl apply -f /home/${EC2_NAME}/k8s/namespace.yaml'"

                        // Apply all remaining manifests
                        sh "ssh -o StrictHostKeyChecking=no ${EC2_NAME}@${EC2_IP} 'kubectl apply -f /home/${EC2_NAME}/k8s/'"

                        // Optional wait
                        sleep(time: 30, unit: 'SECONDS')
                    }
                }
            }
        }

        stage('Verify Deployment') {
            steps {
                sshagent (credentials: ["${SSH_CRED}"]) {
                    sh "ssh -o StrictHostKeyChecking=no ${EC2_NAME}@${EC2_IP} 'kubectl get all -n nextjs-app'"
                }
            }
        }
    }

    post {
        always {
            echo 'Pipeline successfully ran & deployed to Kubernetes! 🎉'
        }
        failure {
            echo 'Pipeline failed. 😭'
        }
    }
}
