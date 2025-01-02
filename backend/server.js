import express from 'express';
import cors from 'cors';
import { articleRouter } from './routes/articles';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5174'],
  credentials: true
}));

app.use(express.json());
app.use('/api', articleRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});