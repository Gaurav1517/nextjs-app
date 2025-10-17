#!/bin/bash
apt-get update -y
apt-get upgrade -y
apt-get install -y python3 python3-apt
swapoff -a
sed -i.bak '/ swap / s/^/#/' /etc/fstab || true
