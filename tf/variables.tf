variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "ssh_cidr" {
  type        = string
  description = "CIDR allowed to SSH into instances"
  default     = "0.0.0.0/0"
}

variable "jenkins_instance_type" {
  type    = string
  default = "t3.medium"
}

variable "k8s_instance_type" {
  type    = string
  default = "t3.medium"
}

variable "tags" {
  type = map(string)
  default = {
    Project = "jenkins-k8s"
    Owner   = "devops"
  }
}
