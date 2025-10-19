output "jenkins_public_ip" {
  value = aws_instance.jenkins.public_ip
}

output "jenkins_private_ip" {
  value = aws_instance.jenkins.private_ip
}

output "jenkins_endpoint" {
  value = "http://${aws_instance.jenkins.public_ip}:8080"
}

output "k8s_public_ip" {
  value = aws_instance.k8s_master.public_ip
}

output "k8s_private_ip" {
  value = aws_instance.k8s_master.private_ip
}
