import express from 'express';
import router from './router';

const app = express();

app.use(express.json());

// Routing
app.use('/', router)

export default app;