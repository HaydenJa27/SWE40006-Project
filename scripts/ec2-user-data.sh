#!/bin/bash
set -e

# ==============================================================================
# SWE40006 - EC2 Instance Provisioning Script
# Automatically configures Docker, Docker Compose, 2GB Swap, and non-root access
# ==============================================================================

echo ">>> [1/5] Updating system packages..."
export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get upgrade -y
apt-get install -y ca-certificates curl gnupg lsb-release git ufw htop

echo ">>> [2/5] Creating 2GB Swap space (Prevents OOM on t2.micro/t3.micro instances)..."
if [ ! -f /swapfile ]; then
    fallocate -l 2G /swapfile || dd if=/dev/zero of=/swapfile bs=1M count=2048
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    echo '/swapfile none swap sw 0 0' >> /etc/fstab
    sysctl vm.swappiness=10
    echo 'vm.swappiness=10' >> /etc/sysctl.conf
fi

echo ">>> [3/5] Installing official Docker Engine & Docker Compose plugin..."
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  tee /etc/apt/sources.list.d/docker.list > /dev/null

apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

echo ">>> [4/5] Enabling Docker service and granting permissions to ubuntu user..."
systemctl enable docker
systemctl start docker
usermod -aG docker ubuntu

echo ">>> [5/5] Creating application workspace directory..."
mkdir -p /home/ubuntu/app
chown -R ubuntu:ubuntu /home/ubuntu/app

echo ">>> EC2 instance bootstrap completed successfully!"
