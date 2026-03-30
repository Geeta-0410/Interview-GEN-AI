# Quick Deployment Checklist - Interview-AI on AWS

## ✅ What's Ready

Your project is containerized and ready for AWS deployment with:
- ✅ Docker images for backend and frontend
- ✅ docker-compose.yml for local testing
- ✅ GitHub Actions CI/CD pipeline (auto-build & push to AWS ECR)
- ✅ Complete AWS deployment guide

## 🚀 Quick Start (5 Steps)

### Step 1: Create AWS Account & Get Credentials
- Sign up at https://console.aws.amazon.com/
- Create an IAM user with ECR and ECS permissions
- Generate Access Key ID and Secret Access Key

### Step 2: Add GitHub Secrets
Go to your GitHub repo → Settings → Secrets and variables → Actions

Add these secrets:
```
AWS_ACCOUNT_ID        → Your 12-digit AWS account ID
AWS_ACCESS_KEY_ID     → From IAM user credentials
AWS_SECRET_ACCESS_KEY → From IAM user credentials
AWS_ECS_CLUSTER       → interview-ai-cluster (create later)
```

### Step 3: Test Locally with Docker
```bash
# Build and run locally
docker-compose up --build

# Visit http://localhost and http://localhost:3000
```

### Step 4: Deploy to AWS
Choose one option:

#### **Option A: AWS ECS Fargate (Recommended)**
```bash
# Follow DEPLOYMENT.md Section: "Option 1: AWS ECS with Fargate"
# Takes ~15 minutes to set up
# Cost: ~$30-50/month
```

#### **Option B: AWS App Runner (Easiest)**
```bash
# Follow DEPLOYMENT.md Section: "Option 2: AWS App Runner"
# Takes ~5 minutes to set up
# Cost: ~$10-30/month
```

#### **Option C: AWS EC2 (Traditional)**
```bash
# Follow DEPLOYMENT.md Section: "Option 3: AWS EC2"
# Takes ~10 minutes to set up
# Cost: ~$30/month
```

### Step 5: Configure Environment Variables
In AWS (via Secrets Manager or ECS Task Definition):
```
MONGO_URI               → Your MongoDB Atlas connection string
GOOGLE_GENAI_API_KEY    → Your Google Generative AI API key
JWT_SECRET              → Your JWT secret (generate: openssl rand -hex 32)
```

## 🔄 CI/CD Pipeline

After deployment setup is complete:
1. Make code changes locally
2. Push to GitHub (`git push`)
3. GitHub Actions automatically:
   - Builds Docker images
   - Pushes to AWS ECR
   - Updates your AWS service
4. Your app is live! (2-3 minutes)

## 📊 Expected Costs

| Component | Cost | Notes |
|-----------|------|-------|
| ECS Fargate | $30-50/mo | Recommended |
| MongoDB Atlas | $57+/mo | Or free tier for dev |
| Data Transfer | $1-5/mo | Minimal |
| **Total** | **~$90-110/mo** | For production |

## 🛠️ Useful Commands

### Local Development
```bash
# Run locally with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild specific service
docker-compose build backend
docker-compose build frontend
```

### AWS Management
```bash
# View ECS services
aws ecs list-services --cluster interview-ai-cluster

# View running tasks
aws ecs list-tasks --cluster interview-ai-cluster

# View container logs
aws logs tail /ecs/interview-ai --follow

# Update service (deploy latest)
aws ecs update-service --cluster interview-ai-cluster \
  --service interview-ai-service --force-new-deployment
```

### Troubleshooting
```bash
# Check if Docker images are in ECR
aws ecr describe-repositories

# Verify GitHub Actions workflow
# Go to GitHub repo → Actions tab

# Check AWS permissions
aws iam get-user

# Test Docker build locally
docker build -t test-backend ./Backend
docker build -t test-frontend ./Frontend
```

## 📚 Detailed Resources

- **Full AWS Setup Guide**: See `DEPLOYMENT.md`
- **Docker Best Practices**: `Dockerfile` and `docker-compose.yml`
- **CI/CD Pipeline**: `.github/workflows/build-and-deploy.yml`
- **Project README**: `README.md`

## 🎯 Next Steps After Deployment

1. ✅ Set up custom domain (Route 53)
2. ✅ Configure SSL/TLS (AWS Certificate Manager)
3. ✅ Enable CDN (CloudFront)
4. ✅ Set up monitoring (CloudWatch)
5. ✅ Configure auto-scaling
6. ✅ Set up backups

## 💡 Tips

- **Save time**: Use App Runner if you're in a hurry
- **Save money**: Use ECS Fargate for production
- **Development**: Use docker-compose locally
- **Performance**: Monitor CloudWatch for bottlenecks
- **Security**: Keep AWS credentials in GitHub secrets, never in code

## ⚠️ Important

- **Never commit `.env` file** (.gitignore prevents this)
- **Keep credentials safe** - Use AWS Secrets Manager in production
- **Monitor costs** - AWS bills can surprise you; set up billing alerts
- **Test locally first** - Use `docker-compose up` before pushing

## 🆘 Need Help?

1. Check `DEPLOYMENT.md` for detailed instructions
2. Review GitHub Actions logs: GitHub repo → Actions tab
3. Check AWS CloudWatch logs for runtime errors
4. Verify all GitHub secrets are set correctly
5. Ensure Docker images are building successfully

---

**Ready to go live? Start with Option B (App Runner) for fastest deployment! 🚀**
