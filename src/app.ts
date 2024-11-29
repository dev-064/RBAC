import express, { Application } from 'express';

const app: Application = express();

// Middleware
app.use(express.json());

// Routes

export default app;
