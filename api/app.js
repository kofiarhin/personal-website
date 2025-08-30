import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

const app = express();

app.use(helmet());
app.use(cors());
app.use(rateLimit({ windowMs: 60 * 1000, max: 100 }));

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

export default app;
