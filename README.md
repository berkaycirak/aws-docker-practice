# Full-Stack Image Upload Application

A full-stack web application demonstrating modern web development practices, cloud services integration, and secure authentication. This project serves as a practical implementation of various technologies commonly used in production environments.

## 🚀 Features

- **User Authentication**

  - JWT-based authentication
  - Secure password handling
  - Protected routes

- **Image Management**

  - Upload images to AWS S3
  - View uploaded images
  - Image metadata storage in PostgreSQL

- **Modern Stack**
  - React TypeScript frontend
  - Node.js/Express backend
  - PostgreSQL database
  - Docker containerization

## 🛠 Technologies

### Frontend

- React with TypeScript
- Modern UI components
- Responsive design
- Axios for API calls

### Backend

- Node.js with Express
- TypeScript
- JWT authentication
- PostgreSQL with TypeORM
- AWS SDK for S3 integration

### Cloud Services

- AWS S3 for image storage
- Docker for containerization
- PostgreSQL for data persistence

## 🏗 Project Structure

```
├── frontend/                # React TypeScript frontend
├── backend/                 # Node.js Express backend
├── docker-compose.yml      # Docker composition
└── .env.example           # Environment variables template
```

## 🚦 Getting Started

1. **Clone the repository**

   ```bash
   git clone [repository-url]
   cd [repository-name]
   ```

2. **Environment Setup**

   - Copy `.env.example` to `.env`
   - Fill in your environment variables:
     - AWS credentials
     - Database credentials
     - JWT secret

3. **Using Docker**

   ```bash
   docker-compose up
   ```

4. **Manual Setup (Alternative)**

   Backend:

   ```bash
   cd backend
   npm install
   npm run dev
   ```

   Frontend:

   ```bash
   cd frontend
   npm install
   npm start
   ```

## 🔑 Environment Variables

Required environment variables:

- `NODE_ENV`: Application environment
- `BACKEND_PORT`: Backend server port
- `FRONTEND_PORT`: Frontend server port
- `POSTGRES_*`: Database configuration
- `JWT_*`: JWT configuration
- `AWS_*`: AWS credentials and configuration

## 🎯 Learning Outcomes

This project demonstrates:

- Full-stack application architecture
- Cloud service integration (AWS S3)
- Authentication and authorization
- Database design and management
- Docker containerization
- Environment configuration
- API design and implementation
- Frontend state management
- TypeScript usage in both frontend and backend

## 📝 License

This project is open-source and available under the MIT License.

## 🤝 Contributing

Feel free to fork this project and submit pull requests. You can also open issues for bugs or feature requests.
