# Deploy Interview-AI on Render

Render is a modern cloud platform that makes deploying applications simple and free. This guide will help you deploy your Interview-AI application in minutes!

## Why Render?

✅ **Free tier** - No credit card required  
✅ **Simple deployment** - Connect GitHub and deploy with one click  
✅ **Auto-deploy** - Updates on every git push  
✅ **Easy environment variables** - No complex AWS setup  
✅ **Great for learning** - Perfect for side projects  

---

## 📋 Prerequisites

- GitHub account with Interview-GEN-AI repository pushed
- Render account (free at https://render.com)
- MongoDB Atlas connection string
- Google Generative AI API key

---

## 🚀 Step-by-Step Deployment

### Step 1: Sign Up on Render

1. Go to https://render.com
2. Click **"Get started"**
3. Sign up with **GitHub** (easiest option)
4. Authorize Render to access your GitHub

---

### Step 2: Deploy Backend Service

1. After login, go to **Dashboard**
2. Click **"New"** → **"Web Service"**
3. Select **"Interview-GEN-AI"** repository
4. Configure:
   - **Name**: `interview-ai-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd Backend && npm install`
   - **Start Command**: `cd Backend && npm start`
   - **Plan**: `Free`

5. Leave other settings as default
6. Click **"Create Web Service"**

---

### Step 3: Add Environment Variables (Backend)

While backend is deploying:

1. Go to Backend service → **"Environment"** tab
2. Click **"Add Environment Variable"** 
3. Add these 3 variables:

**Variable 1 - MongoDB Connection:**
```
Key:   MONGO_URI
Value: mongodb+srv://username:password@cluster.mongodb.net/interview-ai?retryWrites=true&w=majority
```

**Variable 2 - Google Gemini API:**
```
Key:   GOOGLE_GENAI_API_KEY  
Value: AIzaSy... (your Google Gemini API key)
```

**Variable 3 - JWT Secret:**
```
Key:   JWT_SECRET
Value: your-random-secret-key-at-least-32-characters
```

4. Also add:
```
Key:   NODE_ENV
Value: production
```

5. Click **"Save"** - Render will auto-redeploy

---

### Step 4: Deploy Frontend Service

1. Click **"New"** → **"Static Site"** (or **"Web Service"** if using preview mode)
2. Select **"Interview-GEN-AI"** repository
3. Configure:
   - **Name**: `interview-ai-frontend`
   - **Build Command**: `cd Frontend && npm install && npm run build`
   - **Publish Directory**: `Frontend/dist`

4. Click **"Create Static Site"**

---

### Step 5: Configure Frontend API Connection

After frontend deploys:

1. Go to Frontend service → **"Environment"** tab  
2. Add environment variable:
```
Key:   VITE_API_URL
Value: https://interview-ai-backend.onrender.com
```

*(Replace with your actual backend URL from Step 3)*

3. Manually redeploy frontend:
   - Click **"Manual Deploy"** → **"Deploy latest commit"**

---

### Step 6: Connect Services

Update your Frontend code to use the environment variable:

In `Frontend/src/features/auth/services/auth.api.js`:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
```

Make sure axios uses this base URL.

---

## ✅ Verification

Once both services show "Live":

1. **Backend URL**: `https://interview-ai-backend.onrender.com`
   - Test: `https://interview-ai-backend.onrender.com/api/auth/get-me`
   - And you should get a 401 (expected - no token)

2. **Frontend URL**: `https://interview-ai-frontend.onrender.com`
   - Open in browser
   - Should load the Interview-AI app

---

## 🔄 Auto-Deployment on Push

From now on:

```bash
git add .
git commit -m "your message"
git push origin main
```

Render **automatically detects** and **deploys** your changes within 1-2 minutes!

---

## 💾 Getting Your URLs

Once deployed:

- **Backend**: Go to backend service → copy your URL from "Domains" section
- **Frontend**: Go to frontend service → copy your URL

---

## 🆘 Troubleshooting

### Backend won't deploy

Check the **"Logs"** tab:
```
- If "npm install" fails → Check Backend/package.json dependencies
- If "npm start" fails → Check Backend/server.js
- If "MONGO_URI" error → Environment variable not set
```

### Frontend won't build

Check the build logs:
```
- If build fails → Check Frontend/package.json
- If can't connect to API → Update VITE_API_URL
```

### Can't connect to MongoDB

```
- Verify MONGO_URI is correct
- Check MongoDB Atlas → Network Access → Allow All IPs (0.0.0.0/0)
- Verify username/password in connection string
```

### Free tier limitations

Render free tier:
- Services spin down after 15 minutes of inactivity
- First request after spin-down takes 30 seconds (cold start)
- Upgrade to paid to avoid this (~$7/month per service)

---

## 📊 Render Pricing

| Plan | Cost | Best For |
|------|------|----------|
| **Free** | $0/month | Learning, testing, hobby projects |
| **Starter** | $7/month | Small production apps |
| **Pro** | $12+/month | Production apps with guaranteed uptime |

---

## 🎯 Next Steps After Deployment

1. **Test the app**
   - Create an account
   - Generate an interview plan
   - Verify everything works

2. **Set up custom domain** (optional)
   - Go to service → Settings → Custom Domain
   - Add your domain here

3. **Monitor performance**
   - Go to service → Metrics tab
   - Watch for errors, latency, etc.

4. **Set up notifications** (optional)
   - Service → Settings → Notifications
   - Get alerts on deployment failures

---

## 📝 Useful Commands

### View deployment logs
```bash
# SSH into Render service
ssh -i render_key yourservice.onrender.com
```

### Manually redeploy
- Go to service → Click "Manual Deploy" → "Deploy latest commit"

### View build logs
- Go to service → Events tab → Click build to see logs

---

## ⚠️ Important Notes

- **Never commit `.env` file** - Use Render's environment variables instead
- **Keep API keys safe** - Use VITE_API_URL for frontend, not hardcoded URLs
- **Monitor costs** - Free tier works best for single services, consider upgrading if needed
- **Cold starts** - First request after 15 min inactivity takes ~30 seconds

---

## 🎉 You're Done!

Your Interview-AI is now live on Render! Share your app URL:

```
https://interview-ai-frontend.onrender.com
```

Every push to GitHub automatically updates both services! 🚀

---

## 📚 Helpful Resources

- **Render Docs**: https://render.com/docs
- **Render Dashboard**: https://dashboard.render.com
- **Render Status**: https://status.render.com

---

**Questions? Check Render's support or the docs linked above!**
