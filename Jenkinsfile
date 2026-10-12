pipeline {
    agent any

    options {
        timestamps()
    }

    environment {
        MINIKUBE_HOME = '/var/lib/jenkins/.minikube'
        KUBECONFIG = '/var/lib/jenkins/.kube/config'
    }

    stages {
        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Lint') {
            steps {
                sh 'npm run lint'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Docker Build') {
            steps {
                sh 'docker build -t ai-productivity-dashboard:${BUILD_NUMBER} .'
            }
        }

        stage('Load Image into Minikube') {
            steps {
                sh 'minikube image load ai-productivity-dashboard:${BUILD_NUMBER}'
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh '''
                    kubectl apply -f k8s-postgres.yaml

                    sed "s#image: ai-productivity-dashboard:6#image: ai-productivity-dashboard:${BUILD_NUMBER}#" k8s-app.yaml | kubectl apply -f -

                    kubectl rollout status deployment/postgres --timeout=180s

                    kubectl rollout status deployment/ai-productivity-dashboard --timeout=180s
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                sh '''
                    kubectl get deployments
                    kubectl get pods
                    kubectl get services

                    kubectl exec deployment/ai-productivity-dashboard -- node -e '
                        fetch("http://127.0.0.1:3000/api/health")
                            .then(async response => {
                                const body = await response.text();

                                console.log("HTTP status:", response.status);
                                console.log("Health response:", body);

                                if (!response.ok) {
                                    process.exitCode = 1;
                                    return;
                                }

                                const data = JSON.parse(body);

                                if (data.status !== "ok" || data.database !== "connected") {
                                    console.error("Application health verification failed");
                                    process.exitCode = 1;
                                }
                            })
                            .catch(error => {
                                console.error(error);
                                process.exitCode = 1;
                            });
                    '
                '''
            }
        }
    }
}