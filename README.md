# Interview-GEN-AI

An AI-powered interview preparation platform that generates personalized interview strategies, technical questions, and behavioral insights using Google Gemini AI.

## Features

✨ **AI-Powered Interview Strategy** - Generates customized interview preparation based on job description and your profile
📋 **Resume Analysis** - Extracts key skills and experience from your resume
🤖 **Smart Q&A Generation** - Creates technical and behavioral questions tailored to the role
📊 **Skill Gap Analysis** - Identifies areas for improvement and provides learning roadmap
💾 **Interview History** - Save and review multiple interview preparations
🔐 **Secure Authentication** - User authentication with JWT tokens

## Tech Stack

### Frontend
- **React** - UI library
- **Vite** - Fast build tool
- **Axios** - HTTP client
- **SCSS** - Styling
- **React Context API** - State management

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database (Atlas)
- **Mongoose** - ODM
- **Google Generative AI** - AI engine (Gemini Flash)
- **JWT** - Authentication
- **Multer** - File upload handling
- **pdf-parse** - PDF parsing
- **Puppeteer** - PDF generation

## Prerequisites

- Node.js (v16+)
- npm or yarn
- MongoDB Atlas account
- Google Generative AI API key
- Git

## Installation

### 1. Clone the repository
```bash
git clone https://github.com/Geeta-0410/Interview-GEN-AI.git
cd Interview-GEN-AI
```

### 2. Backend Setup
```bash
cd Backend
npm install
```

Create a `.env` file in the Backend directory:
```
MONGO_URI=your_mongodb_connection_string
GOOGLE_GENAI_API_KEY=your_google_gemini_api_key
JWT_SECRET=your_secret_key_here
PORT=3000
```

### 3. Frontend Setup
```bash
cd ../Frontend
npm install
```

### 4. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd Backend
npm start
```
Backend runs on `http://localhost:3000`

**Terminal 2 - Frontend:**
```bash
cd Frontend
npm run dev
```
Frontend runs on `http://localhost:5174`

## Project Structure

```
Interview-GEN-AI/
├── Backend/
│   ├── src/
│   │   ├── app.js                 # Express app configuration
│   │   ├── config/
│   │   │   └── database.js        # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   └── interview.controller.js
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js
│   │   │   └── file.middleware.js
│   │   ├── models/
│   │   │   ├── user.model.js
│   │   │   ├── blacklist.model.js
│   │   │   └── interviewReport.model.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   └── interview.routes.js
│   │   └── services/
│   │       └── ai.service.js      # Gemini AI integration
│   ├── server.js
│   └── package.json
│
├── Frontend/
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx
│   │   ├── app.routes.jsx
│   │   ├── features/
│   │   │   ├── auth/              # Authentication pages
│   │   │   └── interview/         # Interview preparation pages
│   │   └── style/
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/get-me` - Get current user

### Interview
- `POST /api/interview/generate-report` - Generate interview strategy
- `GET /api/interview/reports` - Get user's reports
- `GET /api/interview/reports/:id` - Get specific report

## Usage

1. **Register/Login** - Create an account or login
2. **Create Interview Plan** - Fill in:
   - Target Job Description
   - Upload resume (PDF/DOCX) OR enter self-description
3. **Generate Strategy** - AI generates personalized interview preparation
4. **Review Results** - See:
   - Technical questions
   - Behavioral questions
   - Skill gap analysis
   - Preparation roadmap

## Performance Notes

- Interview report generation takes 30-60 seconds (Gemini API processing)
- Large PDF files may take longer to parse
- First-time requests may take slightly longer due to API initialization

## 🚀 Deployment

### Deploy on Render (Recommended - Free)

Render is the easiest way to deploy your Interview-AI application for free!

**Quick Deploy:**
1. Go to https://render.com
2. Sign up with GitHub
3. Follow the step-by-step guide in [RENDER-DEPLOYMENT.md](RENDER-DEPLOYMENT.md)

**Features:**
- ✅ Free tier available
- ✅ Auto-deploy on GitHub push
- ✅ No credit card required
- ✅ Zero configuration needed

**Deployment Time:** ~5 minutes

👉 **[See Full Render Deployment Guide →](RENDER-DEPLOYMENT.md)**

---

## Known Issues

- Timeout may occur on very large resume files (>10MB)
- Some PDF formats may not parse correctly
- API rate limits apply per Google Generative AI plan
- Free tier services spin down after 15 minutes of inactivity on Render

## Future Enhancements

- Mock interview with recorded video
- Interview feedback and scoring
- Export interview prep as PDF
- Share interview plans
- Mobile app
- Advanced analytics dashboard

## Environment Variables

### Backend (.env)
```
MONGO_URI          # MongoDB Atlas connection string
GOOGLE_GENAI_API_KEY # Google Generative AI API key
JWT_SECRET         # Secret for JWT token signing
PORT               # Server port (default: 3000)
NODE_ENV           # Set to 'production' for production
```

### Frontend (.env)
```
VITE_API_URL       # Backend API URL (e.g., http://localhost:3000)
```

## Troubleshooting

### Port already in use
```bash
# Find and kill process on port 3000 (backend)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Find and kill process on port 5174 (frontend)
netstat -ano | findstr :5174
taskkill /PID <PID> /F
```

### CORS errors
Ensure backend CORS is configured for frontend URL:
- `http://localhost:5173`
- `http://localhost:5174`

### MongoDB connection issues
- Verify MongoDB Atlas connection string
- Check IP whitelist in MongoDB Atlas
- Ensure network access is enabled

### API key issues
- Verify Google Generative AI API key is valid
- Check API quota in Google Cloud Console
- Ensure API is enabled for your project

## Contributing

Pull requests are welcome! For major changes, please open an issue first.

## License

MIT License

## Author

**Geeta-0410**

## Support

For issues and questions, please open an issue in the GitHub repository.

---

**Happy Interview Preparation! 🚀**
