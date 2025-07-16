# 75 Hard Tracker - Modular Architecture

A comprehensive fitness tracking application for the 75 Hard challenge, built with a modular architecture for maintainability and scalability.

## 🏗️ Architecture Overview

### Backend (Flask + MongoDB)
```
backend/
├── app.py                 # Main application entry point
├── config.py             # Configuration management
├── database.py           # Database operations and connection
├── requirements.txt      # Python dependencies
├── services/
│   └── stats_service.py  # Business logic for statistics
└── routes/
    └── progress_routes.py # API route handlers
```

### Frontend (React + Tailwind CSS)
```
frontend/src/
├── App.js               # Main application component
├── components/          # Reusable UI components
│   ├── Header.js        # Application header
│   ├── Navigation.js    # Tab navigation
│   ├── TodayTab.js      # Today's progress view
│   ├── HistoryTab.js    # History view
│   ├── StatsTab.js      # Statistics view
│   ├── WaterTracker.js  # Water tracking component
│   ├── TaskCard.js      # Individual task component
│   └── LoadingSpinner.js # Loading state component
├── hooks/               # Custom React hooks
│   └── useProgress.js   # Progress data management
├── services/            # API services
│   └── api.js          # HTTP client and API calls
├── utils/               # Utility functions
│   └── helpers.js      # Common helper functions
└── constants/           # Application constants
    └── tasks.js        # Task definitions and icons
```

## 🚀 Features

- **Daily Task Tracking**: Track 7 daily tasks for the 75 Hard challenge
- **Water Intake Tracking**: Special UI for tracking water consumption (1 gallon goal)
- **Progress History**: View historical progress data
- **Statistics Dashboard**: Comprehensive analytics and streaks
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Updates**: Instant feedback on task completion

## 🛠️ Technology Stack

### Backend
- **Flask**: Python web framework
- **MongoDB**: NoSQL database
- **PyMongo**: MongoDB driver for Python
- **Flask-CORS**: Cross-origin resource sharing

### Frontend
- **React**: JavaScript UI library
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client
- **Lucide React**: Icon library
- **Recharts**: Charting library for statistics

## 📋 Prerequisites

- Python 3.8+
- Node.js 16+
- MongoDB (running locally or accessible)
- npm or yarn

## 🔧 Installation & Setup

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Start MongoDB** (if running locally):
   ```bash
   mongod
   ```

5. **Run the backend server:**
   ```bash
   python app.py
   ```
   The backend will run on `http://localhost:8917`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```
   The frontend will run on `http://localhost:6896`

## 🏛️ Architecture Benefits

### Backend Modularity
- **Separation of Concerns**: Database, business logic, and routes are separated
- **Configuration Management**: Centralized configuration with environment variable support
- **Service Layer**: Business logic isolated in service classes
- **Blueprint Pattern**: Routes organized using Flask blueprints
- **Error Handling**: Comprehensive error handling and logging

### Frontend Modularity
- **Component-Based Architecture**: Reusable, testable components
- **Custom Hooks**: Encapsulated state management and side effects
- **Service Layer**: Centralized API communication
- **Utility Functions**: Reusable helper functions
- **Constants Management**: Centralized configuration and constants

## 🔄 Data Flow

1. **User Interaction** → Component triggers action
2. **Custom Hook** → Manages state and API calls
3. **API Service** → Makes HTTP requests to backend
4. **Backend Route** → Handles request and delegates to service
5. **Service Layer** → Processes business logic
6. **Database** → Stores/retrieves data
7. **Response** → Flows back through the chain to update UI

## 🧪 Testing

### Backend Testing
```bash
cd backend
python -m pytest
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 📦 Deployment

### Backend Deployment
- Configure environment variables for production
- Use a production WSGI server (Gunicorn)
- Set up MongoDB connection string
- Configure CORS origins for production domain

### Frontend Deployment
- Build the production bundle: `npm run build`
- Deploy to static hosting (Netlify, Vercel, etc.)
- Update API base URL for production

## 🔧 Configuration

### Environment Variables
```bash
# Backend
FLASK_DEBUG=False
FLASK_PORT=8917
MONGO_URI=mongodb://localhost:27017/

# Frontend
REACT_APP_API_BASE_URL=http://localhost:8917
```

## 📈 Future Enhancements

- User authentication and multi-user support
- Push notifications for daily reminders
- Social features and sharing
- Advanced analytics and insights
- Mobile app development
- Integration with fitness trackers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes following the modular architecture
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
