# Google Sign-In & Paystack Payment API

A backend API that provides secure endpoints for Google OAuth authentication and Paystack payment integration.

## Features

- ✅ Google Sign-In authentication
- ✅ Paystack payment initialization
- ✅ Paystack payment verification
- ✅ Security middleware (Helmet, CORS, Rate Limiting)
- ✅ Error handling and validation
- ✅ RESTful API design

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Google Auth Library** - Google OAuth verification
- **Axios** - HTTP client for Paystack API
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Express Rate Limit** - API rate limiting

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Google Cloud Console account (for Google OAuth)
- Paystack account (for payment processing)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/babatundeibukun/hng_stage_8.git
cd hng_stage_8
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Configure the following variables:
     - `GOOGLE_CLIENT_ID`: Your Google OAuth Client ID
     - `PAYSTACK_SECRET_KEY`: Your Paystack Secret Key
     - `PORT`: Server port (default: 3000)

```bash
cp .env.example .env
# Edit .env with your credentials
```

## Configuration

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" and create an OAuth 2.0 Client ID
5. Copy the Client ID to your `.env` file

### Paystack Setup

1. Sign up at [Paystack](https://paystack.com/)
2. Go to [Dashboard Settings](https://dashboard.paystack.com/#/settings/developers)
3. Copy your Secret Key (use test key for development)
4. Add it to your `.env` file

## Running the Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:3000` (or the port specified in `.env`)

## API Endpoints

### 1. Health Check
Get API information and available endpoints.

**Endpoint:** `GET /`

**Response:**
```json
{
  "status": "success",
  "message": "Google Sign-In & Paystack Payment API",
  "endpoints": {
    "auth": {
      "googleSignIn": "POST /auth/google"
    },
    "payment": {
      "initialize": "POST /payment/initialize",
      "verify": "GET /payment/verify/:reference"
    }
  }
}
```

### 2. Google Sign-In

Authenticate users with Google OAuth token.

**Endpoint:** `POST /auth/google`

**Request Body:**
```json
{
  "token": "google_id_token_here"
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Google authentication successful",
  "data": {
    "userId": "115362718293847562891",
    "email": "user@example.com",
    "name": "John Doe",
    "picture": "https://lh3.googleusercontent.com/...",
    "emailVerified": true
  }
}
```

**Error Response (400/401):**
```json
{
  "status": "error",
  "message": "Invalid Google token",
  "error": "Error details"
}
```

**How to Get Google ID Token:**

For testing, you can use the Google OAuth Playground or implement a frontend that uses Google Sign-In:

```html
<!-- Example frontend implementation -->
<script src="https://accounts.google.com/gsi/client" async defer></script>
<div id="g_id_onload"
     data-client_id="YOUR_GOOGLE_CLIENT_ID"
     data-callback="handleCredentialResponse">
</div>
<div class="g_id_signin" data-type="standard"></div>

<script>
function handleCredentialResponse(response) {
  // response.credential is the ID token
  fetch('http://localhost:3000/auth/google', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: response.credential })
  })
  .then(res => res.json())
  .then(data => console.log(data));
}
</script>
```

### 3. Initialize Payment

Create a new payment transaction with Paystack.

**Endpoint:** `POST /payment/initialize`

**Request Body:**
```json
{
  "email": "customer@example.com",
  "amount": 1000.00,
  "currency": "NGN",
  "metadata": {
    "custom_field": "custom_value"
  }
}
```

**Parameters:**
- `email` (required): Customer's email address
- `amount` (required): Amount in currency unit (e.g., 1000 for ₦1000)
- `currency` (optional): Currency code (default: NGN)
- `metadata` (optional): Additional data to attach to transaction

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Payment initialized successfully",
  "data": {
    "authorization_url": "https://checkout.paystack.com/abc123",
    "access_code": "abc123xyz",
    "reference": "ref_xyz123456"
  }
}
```

**Error Response (400/500):**
```json
{
  "status": "error",
  "message": "Failed to initialize payment",
  "error": "Error details"
}
```

**Usage:**
1. Call this endpoint to initialize payment
2. Redirect user to the `authorization_url` returned
3. User completes payment on Paystack's page
4. Use the `reference` to verify payment status

### 4. Verify Payment

Verify the status of a payment transaction.

**Endpoint:** `GET /payment/verify/:reference`

**URL Parameters:**
- `reference`: Payment reference from initialization

**Example:** `GET /payment/verify/ref_xyz123456`

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Payment verification successful",
  "data": {
    "reference": "ref_xyz123456",
    "amount": 1000.00,
    "currency": "NGN",
    "status": "success",
    "paidAt": "2025-12-06T10:30:00.000Z",
    "channel": "card",
    "customer": {
      "email": "customer@example.com"
    },
    "metadata": {
      "custom_field": "custom_value"
    }
  }
}
```

**Payment Status Values:**
- `success` - Payment completed successfully
- `failed` - Payment failed
- `abandoned` - Payment was not completed

**Error Response (400/404/500):**
```json
{
  "status": "error",
  "message": "Failed to verify payment",
  "error": "Error details"
}
```

## Testing

### Testing with cURL

#### 1. Health Check
```bash
curl http://localhost:3000/
```

#### 2. Google Sign-In
```bash
curl -X POST http://localhost:3000/auth/google \
  -H "Content-Type: application/json" \
  -d '{"token": "YOUR_GOOGLE_ID_TOKEN"}'
```

#### 3. Initialize Payment
```bash
curl -X POST http://localhost:3000/payment/initialize \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@example.com",
    "amount": 1000,
    "currency": "NGN"
  }'
```

#### 4. Verify Payment
```bash
curl http://localhost:3000/payment/verify/PAYMENT_REFERENCE
```

### Testing with Postman

1. Import the endpoints into Postman
2. Set up environment variables for base URL
3. Test each endpoint with sample data
4. Check response status codes and data structure

## Security Features

- **Helmet**: Secures Express apps by setting various HTTP headers
- **CORS**: Enables controlled cross-origin resource sharing
- **Rate Limiting**: Limits requests to 100 per 15 minutes per IP
- **Input Validation**: Validates required fields and data types
- **Error Handling**: Comprehensive error handling with appropriate status codes
- **Environment Variables**: Sensitive data stored in environment variables

## Error Handling

The API uses standard HTTP status codes:

- `200` - Success
- `400` - Bad Request (invalid input)
- `401` - Unauthorized (invalid authentication)
- `404` - Not Found (endpoint or resource not found)
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

All error responses follow this format:
```json
{
  "status": "error",
  "message": "Error description",
  "error": "Detailed error information"
}
```

## Project Structure

```
hng_stage_8/
├── index.js           # Main application file
├── package.json       # Dependencies and scripts
├── .env.example       # Environment variables template
├── .gitignore        # Git ignore rules
├── README.md         # This file
└── API_DOCUMENTATION.md  # Detailed API documentation
```

## Development Notes

- The API uses ES6 modules (`import/export`)
- Amounts are automatically converted to kobo/cents for Paystack
- Google tokens are verified server-side for security
- All sensitive operations require proper authentication

## Common Issues

### Google Authentication Fails
- Verify your `GOOGLE_CLIENT_ID` is correct
- Ensure the token is fresh (Google tokens expire)
- Check that the client ID matches the one used to generate the token

### Paystack Payment Fails
- Verify your `PAYSTACK_SECRET_KEY` is correct
- Use test keys for development
- Ensure amount is a positive number
- Check that email format is valid

### Rate Limit Exceeded
- The API limits requests to 100 per 15 minutes per IP
- Wait for the rate limit window to reset
- Adjust limits in `index.js` if needed for development

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

ISC

## Support

For issues and questions:
- Create an issue on GitHub
- Check existing documentation
- Review Paystack API documentation: https://paystack.com/docs/api/
- Review Google Sign-In documentation: https://developers.google.com/identity/sign-in/web/backend-auth

## Production Deployment

Before deploying to production:

1. Set `NODE_ENV=production` in environment
2. Use production credentials for Google and Paystack
3. Configure proper CORS origins
4. Set up HTTPS/SSL
5. Implement proper logging and monitoring
6. Review and adjust rate limiting settings
7. Set up database for user persistence (if needed)
8. Implement proper session management (if needed)

## Acknowledgments

- Google OAuth for authentication
- Paystack for payment processing
- Express.js community for excellent middleware
