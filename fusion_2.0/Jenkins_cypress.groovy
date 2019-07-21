NS_IP = 'initial_value'
FUS_IP = 'initial_value'

pipeline {
    agent { label 'master' }

    environment {
        DOCKER_IP = "10.3.77.120"
    }
    parameters {
        string(name: 'VM_NAME', defaultValue: 'NS_UFT', description: 'VM Name for VCenter')
        string(name: 'ISO_NAME', defaultValue: 'NexentaStor5.3.0.10_CERT.iso', description: 'ISO name for napalm')
        string(name: 'USER', defaultValue: 'georgy.malakyan', description: 'Same user for napalm and testrails')
        password(name: 'PASS', defaultValue: 'SECRET', description: 'Same pasword for napalm and testrails user')
    }
    stages {
        stage('Deploy and configure 1st single NS Appliance') {
            steps {
                node('ansible') {
                    deleteDir()
                    git url: 'https://github.com/muirdok/deploy_ns.git'
                    dir("${WORKSPACE}") {
                        ansiblePlaybook(
                                playbook: 'run_me.yml',
                                extraVars: [
                                        config_vm_name: params.VM_NAME + "_" + env.BUILD_NUMBER,
                                        pxe_iso_name: params.ISO_NAME,
                                        napalm_user: params.USER,
                                        napalm_pass: [value: params.PASS, hidden: true],
                                ]
                        )
                        script {
                            env.NS_IP = readFile 'ns_ip'
                        }
                    }
                }
            }
        }
        stage('Deploy and configure single FUSION host on DOCKER') {
            steps {
                node('docker') {
                    sh '''
                        echo Deploy and configure single FUSION host on DOCKER with ${NS_IP};
                        docker run --name fusion_"${BUILD_NUMBER}" -d \
                        -e MGMT_IP="${DOCKER_IP}" --ulimit nofile=65536:65536 --ulimit memlock=-1:-1 \
                        -e TZ="America/Los_Angeles" --memory=16g -e ES_HEAP_SIZE="8g" -i -t \
                        -p 8457:8457 -p 9200:9200 -p 8443:8443 -p 2000:2000 nexenta/fusion
                    '''
                }
            }
        }
        stage('Deploy and run Cypress tests') {
            steps {
                node('cypress') {
                    deleteDir()
                    git url: 'https://github.com/muirdok/fusion-ci-tests.git'
                    sh '''
                    echo "Run Cypress against NS Appliance ${NS_IP} and Fusion ${DOCKER_IP}";
                    cd fusion_2.0;
                     /opt/node_modules/cypress/bin/./cypress run;
                    '''
                }
            }
        }
        stage('Clean Fusion images') {
            steps {
                node('docker') {
                    sh '''
                    echo Kill THEM ALL!;
                    docker stop $(docker ps -aq) && docker rm $(docker ps -aq)
                    '''
                }
            }
        }
    }
}