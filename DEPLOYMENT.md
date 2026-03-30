# AWS Deployment Guide for Interview-AI

This guide will help you deploy the Interview-AI application to AWS using ECS (Elastic Container Service) or EC2.

## Prerequisites

- AWS Account with appropriate permissions
- Docker installed locally
- GitHub repository with secrets configured
- AWS CLI installed and configured
- Node.js and npm (for local development)

## Deployment Options

### Option 1: AWS ECS with Fargate (Recommended - Serverless)

#### Step 1: Set up AWS Secrets Manager

Store your sensitive environment variables:

```bash
aws secretsmanager create-secret \
  --name interview-ai/prod \
  --secret-string '{
    "MONGO_URI": "your-mongodb-atlas-connection-string",
    "GOOGLE_GENAI_API_KEY": "your-google-gemini-api-key",
    "JWT_SECRET": "your-jwt-secret"
  }'
```

#### Step 2: Create ECR Repositories

```bash
# Create backend repository
aws ecr create-repository \
  --repository-name interview-ai-backend \
  --region us-east-1

# Create frontend repository
aws ecr create-repository \
  --repository-name interview-ai-frontend \
  --region us-east-1
```

#### Step 3: Create ECS Cluster

```bash
aws ecs create-cluster --cluster-name interview-ai-cluster --region us-east-1
```

#### Step 4: Create IAM Role for ECS Tasks

```bash
# Create trust policy
cat > ecs-trust-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "ecs-tasks.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF

# Create role
aws iam create-role \
  --role-name ecsTaskExecutionRole \
  --assume-role-policy-document file://ecs-trust-policy.json

# Attach policy
aws iam attach-role-policy \
  --role-name ecsTaskExecutionRole \
  --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy

# Add Secrets Manager permissions
aws iam put-role-policy \
  --role-name ecsTaskExecutionRole \
  --policy-name secrets-policy \
  --policy-document '{
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Action": "secretsmanager:GetSecretValue",
        "Resource": "arn:aws:secretsmanager:*:*:secret:interview-ai/*"
      }
    ]
  }'
```

#### Step 5: Create VPC and Security Group

```bash
# Create VPC (or use default VPC)
VPC_ID=$(aws ec2 describe-vpcs --filters "Name=isDefault,Values=true" --query 'Vpcs[0].VpcId' --output text)

# Create security group
SG_ID=$(aws ec2 create-security-group \
  --group-name interview-ai-sg \
  --description "Security group for Interview-AI" \
  --vpc-id $VPC_ID \
  --query 'GroupId' \
  --output text)

# Allow HTTP/HTTPS
aws ec2 authorize-security-group-ingress \
  --group-id $SG_ID \
  --protocol tcp \
  --port 80 \
  --cidr 0.0.0.0/0

aws ec2 authorize-security-group-ingress \
  --group-id $SG_ID \
  --protocol tcp \
  --port 443 \
  --cidr 0.0.0.0/0

aws ec2 authorize-security-group-ingress \
  --group-id $SG_ID \
  --protocol tcp \
  --port 3000 \
  --cidr 10.0.0.0/8
```

#### Step 6: Configure GitHub Secrets

Add these secrets to your GitHub repository (Settings > Secrets and variables > Actions):

```
AWS_ACCOUNT_ID          # Your AWS account ID
AWS_ACCESS_KEY_ID       # AWS IAM access key
AWS_SECRET_ACCESS_KEY   # AWS IAM secret key
AWS_ECS_CLUSTER         # interview-ai-cluster
```

#### Step 7: Create ECS Task Definition

Use AWS Console or CLI:

```bash
aws ecs register-task-definition \
  --cli-input-json file://task-definition.json
```

Example `task-definition.json`:

```json
{
  "family": "interview-ai-task",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "executionRoleArn": "arn:aws:iam::ACCOUNT_ID:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "interview-ai-backend",
      "image": "ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/interview-ai-backend:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "secrets": [
        {
          "name": "MONGO_URI",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:ACCOUNT_ID:secret:interview-ai/prod:MONGO_URI::"
        },
        {
          "name": "GOOGLE_GENAI_API_KEY",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:ACCOUNT_ID:secret:interview-ai/prod:GOOGLE_GENAI_API_KEY::"
        },
        {
          "name": "JWT_SECRET",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:ACCOUNT_ID:secret:interview-ai/prod:JWT_SECRET::"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/interview-ai",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    },
    {
      "name": "interview-ai-frontend",
      "image": "ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/interview-ai-frontend:latest",
      "portMappings": [
        {
          "containerPort": 80,
          "protocol": "tcp"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/interview-ai",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

#### Step 8: Create ECS Service

```bash
aws ecs create-service \
  --cluster interview-ai-cluster \
  --service-name interview-ai-service \
  --task-definition interview-ai-task \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxx],securityGroups=[sg-xxx],assignPublicIp=ENABLED}" \
  --load-balancers targetGroupArn=arn:aws:elasticloadbalancing:us-east-1:ACCOUNT_ID:targetgroup/interview-ai/xxx,containerName=interview-ai-frontend,containerPort=80 \
  --region us-east-1
```

### Option 2: AWS App Runner (Simplest - Recommended for beginners)

#### Step 1: Create GitHub Connection

```bash
aws apprunner create-connection \
  --provider GITHUB \
  --connection-name github-connection
```

#### Step 2: Create App Runner Service

```bash
aws apprunner create-service \
  --service-name interview-ai \
  --source-configuration '{
    "RepositoryType": "GITHUB",
    "AuthCredential": {
      "ConnectionArn": "arn:aws:apprunner:us-east-1:ACCOUNT_ID:connection/github-connection"
    },
    "ImageRepository": {
      "RepositoryUrl": "ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/interview-ai-backend",
      "RepositoryType": "ECR"
    }
  }' \
  --instance-configuration Cpu=1024,Memory=2048,InstanceRoleArn=arn:aws:iam::ACCOUNT_ID:role/AppRunnerServiceRole \
  --region us-east-1
```

### Option 3: AWS EC2 (Traditional)

#### Step 1: Launch EC2 Instance

```bash
aws ec2 run-instances \
  --image-id ami-0c55b159cbfafe1f0 \
  --instance-type t3.medium \
  --key-name your-key-pair \
  --security-group-ids sg-xxx \
  --iam-instance-profile Name=EC2InstanceProfile
```

#### Step 2: SSH into Instance and Setup

```bash
ssh -i your-key.pem ec2-user@your-instance-ip

# Install Docker
sudo amazon-linux-extras install docker -y
sudo usermod -a -G docker ec2-user

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Clone repository
git clone https://github.com/Geeta-0410/Interview-GEN-AI.git
cd Interview-GEN-AI

# Create .env file
nano .env
# Add your environment variables

# Run with Docker Compose
docker-compose up -d
```

## GitHub Actions Setup

### Required Secrets

Add these to your GitHub repository:

```
AWS_ACCOUNT_ID              # Your AWS account ID
AWS_ACCESS_KEY_ID           # IAM user access key
AWS_SECRET_ACCESS_KEY       # IAM user secret key
AWS_ECS_CLUSTER             # ECS cluster name (for ECS option)
AWS_REGION                  # AWS region (default: us-east-1)
```

### IAM User Permissions

Create an IAM user with these permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ecr:GetAuthorizationToken",
        "ecr:GetDownloadUrlForLayer",
        "ecr:BatchGetImage",
        "ecr:BatchCheckLayerAvailability",
        "ecr:PutImage",
        "ecr:InitiateLayerUpload",
        "ecr:UploadLayerPart",
        "ecr:CompleteLayerUpload",
        "ecr:CreateRepository",
        "ecr:DescribeRepositories"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "ecs:UpdateService",
        "ecs:DescribeServices",
        "ecs:DescribeTaskDefinition",
        "ecs:DescribeTasks",
        "ecs:ListTasks"
      ],
      "Resource": "*"
    }
  ]
}
```

## Docker Local Testing

Test Docker images locally before deployment:

```bash
# Build images
docker-compose build

# Run services
docker-compose up -d

# Check logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Monitoring and Logs

### View CloudWatch Logs

```bash
aws logs tail /ecs/interview-ai --follow
```

### Monitor Application

1. **AWS Console**: View ECS service metrics
2. **CloudWatch**: Monitor CPU, memory, network
3. **Application Logs**: Check container logs in CloudWatch

## Cost Estimation

- **ECS Fargate**: ~$30-50/month (512 CPU, 1GB RAM)
- **App Runner**: ~$10-30/month (varies by usage)
- **EC2 t3.medium**: ~$30/month (compute only)
- **MongoDB Atlas**: Free tier available, $57+/month for production
- **Data Transfer**: Generally minimal (~$1-5/month)

## Troubleshooting

### Container won't start

```bash
# Check task logs
aws ecs describe-tasks \
  --cluster interview-ai-cluster \
  --tasks arn:aws:ecs:... \
  --region us-east-1
```

### Can't connect to backend

1. Check security group rules
2. Verify environment variables in Secrets Manager
3. Check CloudWatch logs for errors

### High latency

1. Check instance CPU/memory utilization
2. Verify MongoDB connection pool size
3. Check network latency to MongoDB Atlas

## Rollback Deployment

```bash
# Update service to previous task definition
aws ecs update-service \
  --cluster interview-ai-cluster \
  --service interview-ai-service \
  --task-definition interview-ai-task:1 \
  --region us-east-1
```

## Next Steps

1. Set up custom domain with Route 53
2. Configure SSL/TLS with AWS Certificate Manager
3. Set up CloudFront CDN for frontend
4. Enable AWS WAF for security
5. Set up auto-scaling policies
6. Configure backup and disaster recovery

## Support

For deployment issues, check:
- AWS ECS Documentation: https://docs.aws.amazon.com/ecs/
- Docker Documentation: https://docs.docker.com/
- GitHub Actions Documentation: https://docs.github.com/en/actions

---

**Ready to deploy? Start with Option 1 (ECS) or Option 2 (App Runner) for best results!**
