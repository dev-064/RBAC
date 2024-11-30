import express, { Application } from 'express';
import userRoutes from './routes/userRoutes';
import adminRoutes from './routes/adminRoutes';
import reportRoutes from './routes/reportRoutes';
import testRoutes from './routes/testRoute';

const app: Application = express();

// Middleware
app.use(express.json());

// Routes

app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/report', reportRoutes);
app.use('/api/test', testRoutes);

export default app;
