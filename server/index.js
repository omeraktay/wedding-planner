import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import guestRouter from './routes/guestRoutes.js';
import todoRouter from './routes/todoRoutes.js';
import { handleAuthErrors } from './middleware/auth.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.get('/test', (req, res) => res.json({ message: 'This works!' }));

app.get('/', (req, res) => res.send('API Running'));
app.use('/api/guests', guestRouter);
app.use('/api/todos', todoRouter);
app.use(handleAuthErrors);

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
})
  .catch(err => console.error('MongoDB connection error:', err));


