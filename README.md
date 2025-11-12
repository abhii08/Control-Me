# Control-Me

A modern full-stack web application built with React and Hono, featuring user authentication and profile management. The application uses Cloudflare Workers for serverless backend deployment and PostgreSQL with Prisma for data persistence.

## 🚀 Features

- **User Authentication**: Secure signup and signin with JWT tokens
- **Profile Management**: View and update user profile information
- **Protected Routes**: Route-level authentication protection
- **Modern UI**: Responsive design with TailwindCSS
- **Type Safety**: Full TypeScript implementation with Zod validation
- **Serverless Backend**: Deployed on Cloudflare Workers
- **Database**: PostgreSQL with Prisma ORM and Accelerate

## 🏗️ Architecture

### Frontend
- **Framework**: React 19 with TypeScript
- **Routing**: React Router DOM v7
- **Styling**: TailwindCSS with PostCSS
- **HTTP Client**: Axios
- **Validation**: Zod schemas
- **Build Tool**: Vite

### Backend
- **Framework**: Hono (lightweight web framework)
- **Runtime**: Cloudflare Workers
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT tokens
- **Validation**: Zod schemas
- **Acceleration**: Prisma Accelerate for connection pooling

## 📁 Project Structure

```
assignment-2/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── Auth.tsx     # Authentication form component
│   │   │   ├── Appbar.tsx   # Navigation bar
│   │   │   ├── Avatar.tsx   # User avatar component
│   │   │   ├── ProtectedRoute.tsx # Route protection wrapper
│   │   │   └── Quote.tsx    # Quote display component
│   │   ├── pages/           # Page components
│   │   │   ├── Profile.tsx  # User profile page
│   │   │   ├── Signin.tsx   # Sign in page
│   │   │   └── Signup.tsx   # Sign up page
│   │   ├── schemas/         # Validation schemas
│   │   ├── types/           # TypeScript type definitions
│   │   ├── config.ts        # Configuration constants
│   │   └── App.tsx          # Main application component
│   ├── package.json
│   └── vite.config.ts
├── backend/                  # Hono backend API
│   ├── src/
│   │   ├── routes/          # API route handlers
│   │   │   ├── auth.ts      # Authentication endpoints
│   │   │   └── user.ts      # User management endpoints
│   │   ├── schemas/         # Validation schemas
│   │   └── index.ts         # Main application entry
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema
│   │   └── migrations/      # Database migrations
│   ├── package.json
│   └── wrangler.jsonc       # Cloudflare Workers configuration
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL database
- Cloudflare account (for deployment)

### 1. Clone the Repository
```bash
git clone https://github.com/abhii08/Control-Me.git
cd assignment-2
```

### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Configure your database URL and JWT secret in wrangler.jsonc
# Update the DATABASE_URL and JWT_SECRET in the vars section

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate deploy

# Start development server
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Update backend URL in src/config.ts if needed
# Start development server
npm run dev
```

## 🔧 Configuration

### Backend Configuration (wrangler.jsonc)
```jsonc
{
  "name": "control-me",
  "main": "src/index.ts",
  "compatibility_date": "2025-11-12",
  "vars": {
    "DATABASE_URL": "your-database-url-here",
    "JWT_SECRET": "your-super-secret-jwt-key-change-this-in-production"
  }
}
```

### Frontend Configuration (src/config.ts)
```typescript
export const BACKEND_URL = "https://your-backend-url.workers.dev"
```

## 🚀 Deployment

### Backend Deployment (Cloudflare Workers)
```bash
cd backend

# Deploy to Cloudflare Workers
npm run deploy
```

### Frontend Deployment
The frontend can be deployed to any static hosting service:

**Vercel:**
```bash
cd frontend
npm run build
# Deploy the dist/ folder to Vercel
```

**Netlify:**
```bash
cd frontend
npm run build
# Deploy the dist/ folder to Netlify
```

## 📚 API Documentation

### Authentication Endpoints

#### POST `/api/v1/auth/signup`
Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe" // optional
}
```

**Response:**
```json
{
  "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "User created successfully"
}
```

#### POST `/api/v1/auth/signin`
Authenticate an existing user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "User signed in successfully"
}
```

### User Endpoints

#### GET `/api/v1/user/profile`
Get current user profile information.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "phone": "+1234567890",
  "createdAt": "2025-11-12T10:30:00.000Z",
  "updatedAt": "2025-11-12T10:30:00.000Z"
}
```

#### PUT `/api/v1/user/profile`
Update user profile information.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "name": "John Smith", // optional
  "phone": "+1234567890" // optional
}
```

## 🧪 Development

### Available Scripts

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

**Backend:**
- `npm run dev` - Start development server with Wrangler
- `npm run deploy` - Deploy to Cloudflare Workers
- `npm run cf-typegen` - Generate Cloudflare types

### Database Schema

```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String   
  name      String?
  phone     String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Passwords are securely hashed before storage
- **Input Validation**: Comprehensive validation using Zod schemas
- **CORS Protection**: Configured CORS for secure cross-origin requests
- **Protected Routes**: Frontend route protection for authenticated users

## 🛡️ Environment Variables

### Backend (.env or wrangler.jsonc vars)
- `DATABASE_URL` - PostgreSQL database connection string
- `JWT_SECRET` - Secret key for JWT token signing

### Frontend
- `VITE_BACKEND_URL` - Backend API URL (optional, defaults to config.ts)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Ensure your DATABASE_URL is correctly configured
   - Check if Prisma Accelerate is properly set up

2. **CORS Errors**
   - Verify the backend URL in frontend config
   - Ensure CORS is properly configured in the backend

3. **JWT Token Issues**
   - Check if JWT_SECRET is set in backend configuration
   - Verify token is being sent in Authorization header

4. **Build Errors**
   - Clear node_modules and reinstall dependencies
   - Check TypeScript configuration

## 📞 Support

For support, email [your-email@example.com] or create an issue in the GitHub repository.

## 🙏 Acknowledgments

- [Hono](https://hono.dev/) - Lightweight web framework
- [Prisma](https://prisma.io/) - Database ORM
- [Cloudflare Workers](https://workers.cloudflare.com/) - Serverless platform
- [React](https://react.dev/) - Frontend framework
- [TailwindCSS](https://tailwindcss.com/) - CSS framework
