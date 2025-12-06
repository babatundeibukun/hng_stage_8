import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { OAuth2Client } from 'google-auth-library';
import axios from 'axios';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Google OAuth Client
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Paystack configuration
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE_URL = 'https://api.paystack.co';

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Google Sign-In & Paystack Payment API',
    endpoints: {
      auth: {
        googleSignIn: 'POST /auth/google'
      },
      payment: {
        initialize: 'POST /payment/initialize',
        verify: 'GET /payment/verify/:reference'
      }
    }
  });
});

// Google Sign-In endpoint
app.post('/auth/google', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        status: 'error',
        message: 'Google ID token is required'
      });
    }

    // Verify Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const userId = payload['sub'];
    const email = payload['email'];
    const name = payload['name'];
    const picture = payload['picture'];
    const emailVerified = payload['email_verified'];

    // Return user information
    res.json({
      status: 'success',
      message: 'Google authentication successful',
      data: {
        userId,
        email,
        name,
        picture,
        emailVerified
      }
    });
  } catch (error) {
    console.error('Google authentication error:', error);
    res.status(401).json({
      status: 'error',
      message: 'Invalid Google token',
      error: error.message
    });
  }
});

// Paystack payment initialization endpoint
app.post('/payment/initialize', async (req, res) => {
  try {
    const { email, amount, currency = 'NGN', metadata = {} } = req.body;

    // Validate required fields
    if (!email || !amount) {
      return res.status(400).json({
        status: 'error',
        message: 'Email and amount are required'
      });
    }

    // Validate amount (must be positive integer in kobo/cents)
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Amount must be a positive number'
      });
    }
    
    // Convert to kobo/cents with proper precision handling
    // Using toFixed to ensure exactly 2 decimal places before converting to integer
    const amountInKobo = parseInt((parsedAmount * 100).toFixed(0), 10);

    // Initialize payment with Paystack
    const response = await axios.post(
      `${PAYSTACK_BASE_URL}/transaction/initialize`,
      {
        email,
        amount: amountInKobo,
        currency,
        metadata
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json({
      status: 'success',
      message: 'Payment initialized successfully',
      data: response.data.data
    });
  } catch (error) {
    console.error('Paystack initialization error:', error.response?.data || error);
    res.status(error.response?.status || 500).json({
      status: 'error',
      message: 'Failed to initialize payment',
      error: error.response?.data?.message || error.message
    });
  }
});

// Paystack payment verification endpoint
app.get('/payment/verify/:reference', async (req, res) => {
  try {
    const { reference } = req.params;

    if (!reference) {
      return res.status(400).json({
        status: 'error',
        message: 'Payment reference is required'
      });
    }

    // Verify payment with Paystack
    const response = await axios.get(
      `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const paymentData = response.data.data;

    res.json({
      status: 'success',
      message: 'Payment verification successful',
      data: {
        reference: paymentData.reference,
        amount: paymentData.amount / 100, // Convert back to main currency unit
        currency: paymentData.currency,
        status: paymentData.status,
        paidAt: paymentData.paid_at,
        channel: paymentData.channel,
        customer: {
          email: paymentData.customer.email
        },
        metadata: paymentData.metadata
      }
    });
  } catch (error) {
    console.error('Paystack verification error:', error.response?.data || error);
    res.status(error.response?.status || 500).json({
      status: 'error',
      message: 'Failed to verify payment',
      error: error.response?.data?.message || error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
    error: err.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Endpoint not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
