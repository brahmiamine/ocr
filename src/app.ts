import express from 'express';
import chatRoutes from './routes/chatRoutes';

const app = express();

app.use(express.json());
app.use('/api/v1', chatRoutes);

export default app;