import express from 'express';
import cors from 'cors';
import healthRoutes from './routes/health.routes.js';
import authRoutes from './routes/auth.routes.js';
import errorHandler from './middleware/errorHandler.js';
import productRoutes from './routes/product.routes.js';
import categoryRoutes from './routes/category.routes.js';



const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);


app.use(errorHandler);

export default app;