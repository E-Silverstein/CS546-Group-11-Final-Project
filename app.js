import express from 'express';
import configRoutes from './routes/index.js';

const app = express();
app.use(express.json());
configRoutes(app);

app.listen(3000, () =>
  console.log('App Running at: localhost:3000'),
);