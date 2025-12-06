# Google Sign-In & Paystack Payment API

Backend API that provides secure endpoints for Google OAuth authentication and Paystack payment integration.

## 🚀 Features

- ✅ Google Sign-In authentication
- ✅ Paystack payment initialization
- ✅ Paystack payment verification
- ✅ Security middleware (Helmet, CORS, Rate Limiting)
- ✅ Comprehensive error handling
- ✅ Input validation
- ✅ RESTful API design

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Google Cloud Console account (for Google OAuth Client ID)
- Paystack account (for payment processing)

## ⚙️ Installation

1. **Clone the repository:**
```bash
git clone https://github.com/babatundeibukun/hng_stage_8.git
cd hng_stage_8
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure environment variables:**
```bash
cp .env.example .env
```

Edit `.env` and add your credentials:
- `GOOGLE_CLIENT_ID` - Get from [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
- `PAYSTACK_SECRET_KEY` - Get from [Paystack Dashboard](https://dashboard.paystack.com/#/settings/developers)
- `PORT` - Server port (default: 3000)

## 🏃 Running the Server

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:3000`

## 📡 API Endpoints

### Health Check
```
GET /
```
Returns API information and available endpoints.

### Google Sign-In
```
POST /auth/google
Content-Type: application/json

{
  "token": "google_id_token_here"
}
```
Authenticates users with Google OAuth token.

### Initialize Payment
```
POST /payment/initialize
Content-Type: application/json

{
  "email": "customer@example.com",
  "amount": 1000.00,
  "currency": "NGN",
  "metadata": {}
}
```
Creates a new payment transaction with Paystack.

### Verify Payment
```
GET /payment/verify/:reference
```
Verifies the status of a payment transaction.

## 📖 Documentation

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for detailed API documentation including:
- Request/response examples
- Error handling
- Testing with cURL and Postman
- Security features
- Common issues and troubleshooting

## 🧪 Testing

**Test health check:**
```bash
curl http://localhost:3000/
```

**Test payment initialization:**
```bash
curl -X POST http://localhost:3000/payment/initialize \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","amount":1000,"currency":"NGN"}'
```

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for more testing examples.

## 🔒 Security Features

- **Helmet**: Secures Express apps by setting HTTP headers
- **CORS**: Enables controlled cross-origin resource sharing
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Input Validation**: All inputs are validated
- **Environment Variables**: Sensitive data stored securely
- **Axios 1.12.0+**: No known vulnerabilities

## 📂 Project Structure

```
hng_stage_8/
├── index.js              # Main application
├── package.json          # Dependencies
├── .env.example          # Environment template
├── .gitignore           # Git ignore rules
├── README.md            # This file
└── API_DOCUMENTATION.md # Detailed API docs
```

## 🛠️ Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Google Auth Library** - OAuth verification
- **Axios** - HTTP client for Paystack
- **Helmet** - Security headers
- **CORS** - Cross-origin handling
- **Express Rate Limit** - Rate limiting

## 📝 License

ISC

## 👥 Support

For issues and questions, please create an issue on GitHub.

## 🔗 Resources

- [Paystack API Documentation](https://paystack.com/docs/api/)
- [Google Sign-In Documentation](https://developers.google.com/identity/sign-in/web/backend-auth)

