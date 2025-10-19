terraform {
  required_providers {
    aws = { source = "hashicorp/aws" }
    tls = { source = "hashicorp/tls" }
  }
}

provider "aws" {
  region = var.aws_region
}

data "aws_vpc" "default" {
  default = true
}

data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"]
  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }
}

resource "tls_private_key" "key" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "local_file" "private_key_pem" {
  content         = tls_private_key.key.private_key_pem
  filename        = "${path.module}/keys/myproject.pem"
  file_permission = "0400"
}

resource "aws_key_pair" "generated_key" {
  key_name   = "myproject-key"
  public_key = tls_private_key.key.public_key_openssh
}

resource "aws_security_group" "jenkins_sg" {
  name        = "jenkins-sg"
  description = "Security group for Jenkins controller"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.ssh_cidr]
  }

  ingress {
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = var.tags
}

resource "aws_security_group" "k8s_master_sg" {
  name        = "k8s-master-sg"
  description = "Security group for K8s control plane"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.ssh_cidr]
  }

  ingress {
    from_port   = 6443
    to_port     = 6443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 2379
    to_port     = 2380
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 10250
    to_port     = 10250
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 10257
    to_port     = 10257
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 10259
    to_port     = 10259
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 53
    to_port     = 53
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 53
    to_port     = 53
    protocol    = "udp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 3000
    to_port     = 32767
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }


  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = var.tags
}

resource "aws_instance" "jenkins" {
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = var.jenkins_instance_type
  subnet_id              = data.aws_subnets.default.ids[0]
  key_name               = aws_key_pair.generated_key.key_name
  vpc_security_group_ids = [aws_security_group.jenkins_sg.id]
  user_data              = file("${path.module}/userdata/jenkins_userdata.sh")
  tags                   = merge(var.tags, { Name = "jenkins-controller" })

  ebs_block_device {
    device_name = "/dev/sda1"
    volume_size = 30
    volume_type = "gp3"
  }

  provisioner "remote-exec" {
    connection {
      type        = "ssh"
      user        = "ubuntu"
      private_key = tls_private_key.key.private_key_pem
      host        = self.public_ip
      timeout     = "5m"
    }
    inline = [
      "sudo apt-get update -y",
      "sleep 10",
      "sudo apt-get install -y software-properties-common",
      "sudo add-apt-repository --yes --update ppa:ansible/ansible",
      "sleep 10",
      "sudo apt-get update -y",
      "sudo apt-get install -y ansible git curl wget vim tree net-tools",
      "sudo fallocate -l 2G /swapfile || sudo dd if=/dev/zero of=/swapfile bs=1M count=2048",
      "sudo chmod 600 /swapfile",
      "sudo mkswap /swapfile || true",
      "sudo swapon /swapfile || true",
      "grep -q '/swapfile' /etc/fstab || echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab",
      "mkdir -p /home/ubuntu/ansible",
      "mkdir -p /home/ubuntu/keys"
    ]
  }

  provisioner "file" {
    connection {
      type        = "ssh"
      user        = "ubuntu"
      private_key = tls_private_key.key.private_key_pem
      host        = self.public_ip
      timeout     = "5m"
    }
    source      = "${path.module}/ansible/"
    destination = "/home/ubuntu/ansible"
  }

  provisioner "file" {
    connection {
      type        = "ssh"
      user        = "ubuntu"
      private_key = tls_private_key.key.private_key_pem
      host        = self.public_ip
      timeout     = "5m"
    }
    source      = "${path.module}/keys/myproject.pem"
    destination = "/home/ubuntu/keys/myproject.pem"
  }

  provisioner "remote-exec" {
    connection {
      type        = "ssh"
      user        = "ubuntu"
      private_key = tls_private_key.key.private_key_pem
      host        = self.public_ip
      timeout     = "5m"
    }
    inline = [
      "chmod 600 /home/ubuntu/keys/myproject.pem",
      "cd /home/ubuntu/ansible",
      "ansible --version || true",
      "ansible-inventory -i inventory.ini --list || true",
      "ansible-playbook -i inventory.ini playbooks/install.yml || true"
    ]
  }
}

resource "aws_instance" "k8s_master" {
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = var.k8s_instance_type
  subnet_id              = data.aws_subnets.default.ids[0]
  key_name               = aws_key_pair.generated_key.key_name
  vpc_security_group_ids = [aws_security_group.k8s_master_sg.id]
  user_data              = file("${path.module}/userdata/k8s_userdata.sh")
  tags                   = merge(var.tags, { Name = "k8s-control-plane" })

  ebs_block_device {
    device_name = "/dev/sda2"
    volume_size = 30
    volume_type = "gp3"
  }
}

resource "local_file" "ansible_inventory" {
  content    = templatefile("${path.module}/ansible/inventory.tmpl", { k8s_ip = aws_instance.k8s_master.public_ip })
  filename   = "${path.module}/ansible/inventory.ini"
  depends_on = [aws_instance.k8s_master]
}






