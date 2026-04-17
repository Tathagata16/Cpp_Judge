import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { connectDB } from './services/db.js';
import authRoutes from './routes/auth.js';
import problemRoutes from './routes/problems.js';
import submissionRoutes from './routes/submissions.js';
import profileRoutes from './routes/profile.js';

dotenv.config();

const app = express();
app.set('trust proxy', 1); // ← add this

const allowedOrigins = [
  // 'http://localhost:5173',
  'https://leetcode-simplified-clone.vercel.app'
];


app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// Rate limit all API calls (100 req / 15 min per IP)
app.use('/api', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: { error: 'Too many requests, please try again later.' },
}));

// Stricter limit on code submissions (10 / min per IP)
app.use('/api/submissions', rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: { error: 'Submission rate limit exceeded. Wait a minute.' },
}));

//R
app.use('/api/auth', authRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/profile', profileRoutes);

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

// ── Start ─────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
