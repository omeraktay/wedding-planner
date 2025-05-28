import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import guestRouter from './routes/guestRoutes.js';

dotenv.config();
const app = express();
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => res.send('API Running'));
app.use('/api/guests', guestRouter);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
})
  .catch(err => console.error('MongoDB connection error:', err));


