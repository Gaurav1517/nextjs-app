# Jenkins (Controller) + Kubernetes (Control Plane) on AWS using Terraform + Ansible (Final)

This project provisions two EC2 instances (Jenkins controller and Kubernetes control plane)
in the default VPC using Terraform. Terraform will:

1. create an RSA keypair and save the private key to `keys/myproject.pem`
2. create Security Groups with the requested ports for both Jenkins and K8s nodes
3. launch two EC2 instances (Jenkins controller + K8s control plane)
4. install Ansible on the Jenkins controller using a Terraform `remote-exec` provisioner
   (the inline commands used are the ones you provided)
5. generate an Ansible inventory (containing the K8s server public IP) and copy the local
   `ansible/` folder to the Jenkins controller
6. run Ansible from the Jenkins controller to install Docker/Jenkins on the controller
   and install Kubernetes/Docker on the K8s control plane

## How it works (quick)
- Run `terraform init` then `terraform validate`, `terraform fmt`, `terraform plan`, and  `terraform apply -auto-approve`.
- Terraform saves the private key to `keys/myproject.pem` (don't commit this).
- After apply finishes, outputs show the public/private IPs of both instances.
- If the remote Ansible run fails, check `terraform apply` output; you can SSH into the controller
  and run the Ansible playbooks manually from `/home/ubuntu/ansible`:
    ssh -i keys/myproject.pem ubuntu@<jenkins_public_ip>
    cd ~/ansible
    ANSIBLE_HOST_KEY_CHECKING=False ansible-playbook -i inventory.ini playbooks/install.yml
