# 🌾 IRAIVI Financial Companion

**Intelligent Rural AI Voice Interface** - Empowering rural women in India with accessible financial technology through voice-first AI and multilingual support.

## 📋 Table of Contents

- [🎯 Project Overview](#-project-overview)
- [🌍 Mission & Vision](#-mission--vision)
- [🚀 Key Features](#-key-features)
- [🏗️ Technology Stack](#️-technology-stack)
- [🌐 Multilingual Support](#-multilingual-support)
- [📱 System Architecture](#-system-architecture)
- [🔧 Installation & Setup](#-installation--setup)
- [🚀 Deployment](#-deployment)
- [📊 Project Structure](#-project-structure)
- [🔒 Security & Privacy](#-security--privacy)
- [🌐 Social Impact](#-social-impact)
- [🤝 Contributing](#-contributing)
- [📞 Contact & Support](#-contact--support)
- [📄 License](#-license)

---

## 🎯 Project Overview

IRAIVI is a comprehensive financial technology platform designed specifically for rural women in India. The platform bridges the digital divide by providing:

### **Core Capabilities**
- **🎤 Voice-First Interface** - Natural language interactions in native languages
- **🏛️ Government Scheme Matching** - AI-powered eligibility analysis for 50+ schemes
- **💰 Financial Management** - Voice-based budget tracking and micro-savings
- **🎓 Entrepreneurship Learning** - Gamified business education with mentorship
- **👥 SHG Community Tools** - Self-Help Group management and coordination
- **📚 Financial Literacy** - Audio-based education for low-literacy users

### **Target Users**
- Rural women (18-65 years) across 10+ Indian states
- Self-Help Groups (SHGs) and community organizations
- Low-literacy populations with limited digital access
- Feature phone users with basic mobile connectivity

---

## 🌍 Mission & Vision

### **Vision**
To empower 200 million rural women in India with financial independence, digital literacy, and entrepreneurial opportunities through technology that speaks their language.

### **Mission**
- Democratize access to financial services and government benefits
- Remove literacy barriers through voice-first technology
- Foster economic independence and community development
- Support sustainable micro-enterprise growth
- Bridge the urban-rural digital divide

---

## 🚀 Key Features

### **🎤 AI Voice Assistant**
- **Speech Recognition**: AssemblyAI-powered voice processing
- **Natural Conversations**: Context-aware dialogue system
- **Multilingual Understanding**: Process 4+ Indian languages
- **Text-to-Speech**: Natural voice responses in user's language
- **Offline Capability**: Core functions work without internet

### **🏛️ Government Scheme Intelligence**
- **50+ Schemes Database**: PM Vishwakarma, Mahila Coir, Women SHG schemes
- **Eligibility Analysis**: AI-powered matching based on user profile
- **Application Guidance**: Step-by-step assistance with documentation
- **Status Tracking**: Real-time application progress monitoring
- **Success Stories**: Community testimonials and case studies

### **💰 Financial Management Tools**
- **Voice Expense Tracking**: "I spent ₹50 on vegetables"
- **Smart Budgeting**: Category-wise spending analysis
- **Micro-Savings Goals**: Small, achievable saving targets
- **Financial Health Score**: Personalized financial assessment
- **Spending Patterns**: Visual analytics and insights

### **🎓 Entrepreneurship Learning**
- **Gamified Education**: Quest-based learning system
- **Credit System**: Earn credits through completing modules
- **Mentor Network**: Connect with experienced entrepreneurs
- **Business Skills**: Practical training in bookkeeping, marketing
- **Progress Tracking**: Learning milestones and achievements

### **👥 SHG Community Management**
- **Group Coordination**: Meeting schedules and reminders
- **Collective Savings**: Pool resources for community projects
- **Financial Reporting**: Group financial health tracking
- **Success Metrics**: Community impact measurement
- **Resource Sharing**: Knowledge and experience exchange

---

## 🏗️ Technology Stack

### **Frontend Architecture**
```
React 18 + TypeScript
├── UI Framework: Tailwind CSS + Shadcn/ui
├── State Management: React Context + Hooks
├── Routing: React Router v6
├── Build Tool: Vite
└── Deployment: Vercel
```

### **Backend Services**
```
Node.js + Express + TypeScript
├── Database: MongoDB + Mongoose
├── Authentication: JWT + Phone OTP
├── File Storage: AWS S3
├── API Gateway: Express Router
└── Deployment: Railway/Render
```

### **AI & Voice Services**
```
Voice Processing Pipeline
├── Speech-to-Text: AssemblyAI API
├── Text-to-Speech: OpenAI TTS
├── Language Detection: Custom ML models
├── Translation: LibreTranslate API
└── Context Management: Redis Cache
```

---

## 🌐 Multilingual Support

### **Supported Languages**
1. **English** - Primary interface language
2. **Hindi (हिन्दी)** - Largest rural user base
3. **Tamil (தமிழ்)** - South Indian states
4. **Telugu (తెలుగు)** - Andhra Pradesh & Telangana

### **Translation System**
- **Dynamic Language Switching**: Real-time UI updates
- **Complete Coverage**: All UI elements and responses
- **Cultural Adaptation**: Contextually appropriate translations
- **Fallback Mechanism**: English as default for missing translations
- **Voice Localization**: Accurate pronunciation and accent

---

## 📱 System Architecture

### **Component Structure**
```
src/
├── components/
│   ├── landing/          # Marketing and onboarding
│   ├── dashboard/        # Main application interface
│   ├── entrepreneurship/ # Learning modules
│   ├── community/        # SHG management
│   └── ui/              # Reusable components
├── pages/               # Route-level components
├── i18n/                # Internationalization
├── hooks/               # Custom React hooks
├── services/            # API integrations
├── utils/               # Helper functions
└── types/               # TypeScript definitions
```

### **API Endpoints**
```
/api/
├── /auth               # User authentication
├── /voice              # Speech processing
├── /schemes            # Government schemes
├── /budget             # Financial management
├── /savings            # Savings tracking
├── /entrepreneurship   # Learning modules
├── /community          # SHG management
└── /analytics          # User insights
```

---

## 🔧 Installation & Setup

### **Prerequisites**
- Node.js 20.16.0+ and npm 10+
- Google Gemini AI API key
- Modern web browser (Chrome/Edge recommended for STT)

### **Local Development Setup**

```bash
# 1. Clone the repository
git clone https://github.com/AJ-coder-st/sakhi-financial-companion.git
cd sakhi-financial-companion

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your API keys and configuration

# 4. Start the development servers
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend API Server
npm run api
```

### **Development URLs**
- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:3001
- **STT Test**: http://localhost:8080/test-stt.html
- **Dashboard**: http://localhost:8080/dashboard

### **Environment Variables**
```env
# Frontend
VITE_API_BASE_URL=http://localhost:3001
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key

# Backend
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key
PORT=3001
```

### **Available Scripts**
```bash
npm run dev          # Start frontend development server
npm run api          # Start backend API server
npm run build        # Build for production
npm run preview      # Preview production build
npm run test         # Run tests
npm run lint         # Run ESLint
```

---

## 🚀 Deployment

### **Frontend Deployment (Vercel)**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to production
vercel --prod

# Or connect to GitHub for auto-deployment
vercel link
```

### **Backend Deployment (Railway)**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

### **Database Setup (MongoDB Atlas)**
1. Create a free MongoDB Atlas account
2. Set up a cluster
3. Configure network access
4. Add connection string to environment variables

---

## 📊 Project Structure

### **Key Directories**
```
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── landing/     # Landing page components
│   │   ├── dashboard/   # Main app components
│   │   ├── entrepreneurship/ # Learning modules
│   │   └── ui/          # Reusable UI components
│   ├── pages/           # Page components
│   ├── i18n/            # Translation files
│   ├── hooks/           # Custom hooks
│   ├── services/        # API services
│   └── utils/           # Utility functions
├── server/              # Backend code
│   ├── controllers/     # API controllers
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   └── middleware/      # Express middleware
└── docs/                # Documentation
```

### **Database Models**
```javascript
// User Profile
{
  name: String,
  phone: String,
  language: String,
  location: String,
  financialProfile: {
    income: Number,
    savings: Number,
    credits: Number,
    level: Number
  },
  preferences: {
    voiceSpeed: Number,
    notifications: Boolean
  }
}

// Government Schemes
{
  name: String,
  description: String,
  eligibility: [String],
  benefits: String,
  applicationProcess: String,
  documents: [String],
  category: String
}
```

---

## 🔒 Security & Privacy

### **Data Protection**
- **DPDP Compliance**: Data Protection and Privacy Act compliant
- **End-to-End Encryption**: All voice and data encrypted
- **Local Storage**: Sensitive data stored locally
- **Minimal Data Collection**: Only essential information collected
- **User Consent**: Explicit consent for all data usage

### **Security Measures**
- **Authentication**: Phone-based OTP system
- **API Security**: JWT tokens and rate limiting
- **Voice Data**: Temporary storage, auto-deletion
- **Financial Data**: Bank-level encryption
- **Privacy Controls**: User-controlled data sharing

---

## 🌐 Social Impact

### **Target Metrics (2026)**
- **User Base**: 5,000 rural women (pilot phase)
- **Financial Inclusion**: 30% increase in bank account usage
- **Scheme Enrollment**: 50+ government schemes accessed
- **Savings Rate**: 25% increase in monthly savings
- **Entrepreneurship**: 100 new micro-enterprises launched

### **Success Indicators**
- **User Retention**: 90% retention rate (90-day)
- **Daily Active Users**: 60% of registered users
- **Voice Interaction Success**: 95% accuracy rate
- **Scheme Match Success**: 80% eligible users successfully apply
- **Financial Literacy**: 40% improvement in financial knowledge

### **Impact Areas**
1. **Financial Inclusion**: Bank account access and usage
2. **Government Benefits**: Scheme awareness and application
3. **Economic Empowerment**: Entrepreneurship opportunities
4. **Digital Literacy**: Technology adoption skills
5. **Community Development**: SHG strengthening

---

## 🤝 Contributing

We welcome contributions from developers, designers, and domain experts!

### **How to Contribute**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### **Development Guidelines**
- Follow the existing code style and conventions
- Write tests for new features
- Update documentation as needed
- Ensure accessibility standards are met
- Test multilingual functionality

### **Areas for Contribution**
- **Frontend**: UI/UX improvements, accessibility enhancements
- **Backend**: API optimization, database improvements
- **AI/ML**: Voice recognition accuracy, language support
- **Content**: Financial education materials, scheme information
- **Testing**: Unit tests, integration tests, user testing

---

## 📞 Contact & Support

### **Project Information**
- **GitHub**: https://github.com/AJ-coder-st/sakhi-financial-companion
- **Documentation**: [PROJECT_REPORT.md](./PROJECT_REPORT.md)
- **Issues**: Report bugs and request features via GitHub Issues

### **Support Channels**
- **Technical Support**: Create GitHub Issue
- **Feature Requests**: Use GitHub Discussions
- **Security Concerns**: Private message to maintainers
- **Partnerships**: Contact via project repository

### **Community**
- **Contributors**: See [Contributors](./CONTRIBUTORS.md)
- **Code of Conduct**: [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)
- **Security Policy**: [SECURITY.md](./SECURITY.md)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

### **Open Source**
- ✅ Commercial use allowed
- ✅ Modification allowed
- ✅ Distribution allowed
- ✅ Private use allowed
- ⚠️ Liability and warranty disclaimed

### **Attribution**
Please credit "IRAIVI Financial Companion" when using or modifying this project.

---

## � Current Working Features (v1.0)

### **✅ Fully Implemented**
- **🎤 Voice Mentor**: Speech-to-text business advisor with ROI calculations
- **📊 Impact Dashboard**: Future Vision, Impact Map, and Voice Mentor integration
- **🗺️ Fixed Sidebar**: Enhanced navigation with proper positioning
- **🌐 Multilingual UI**: English, Hindi, Tamil, Telugu support
- **📱 Responsive Design**: Mobile-first approach with desktop optimization
- **🔧 Development Environment**: Stable dev servers with API integration

### **🚀 Ready for Demo**
- **Speech Recognition**: Browser-based STT with manual fallback
- **Business Intelligence**: Investment-based recommendations
- **Financial Projections**: 12-month future vision calculator
- **Interactive Maps**: Visual impact representation
- **Modern UI**: Professional fintech design with animations

### **📊 API Endpoints Active**
- `/api/health` - Server health check
- `/api/lessons` - Learning content delivery
- `/api/advisor` - AI-powered financial advice
- `/api/schemes` - Government scheme matching

---

## �🏆 Acknowledgments

- **Government of India**: For rural development initiatives
- **Rural Communities**: For valuable feedback and insights
- **Open Source Community**: For tools and libraries
- **Financial Inclusion Experts**: For domain expertise
- **Rural Women**: Our inspiration and primary stakeholders

---

## 🚀 Roadmap

### **Phase 1: Q1-Q2 2026 (Current)**
- ✅ Core platform development
- ✅ Voice AI integration
- ✅ Multilingual support (4 languages)
- ✅ Government scheme database
- ✅ Pilot launch in 3 states

### **Phase 2: Q3-Q4 2026**
- 🔄 Mobile app development
- 🔄 Advanced AI features
- 🔄 Partnerships with banks
- 🔄 Scale to 10 states
- 🔄 Target: 50,000 users

### **Phase 3: Q1-Q2 2027**
- 📋 AI-powered financial advisor
- 📋 Blockchain-based credit scoring
- 📋 International expansion
- 📋 Target: 500,000 users
- 📋 IPO preparation

---

**🌾 Empowering Rural India, One Voice at a Time**

*Last Updated: March 2026 | Version: 1.0.0 | Status: Production Ready*
