import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { config } from './config/environment';
import { errorHandler } from './middlewares/errorHandler';
import { notFoundHandler } from './middlewares/notFound';
import routes from './routes';

const app: Express = express();

// Security Middleware
app.use(helmet());
app.use(cors({ origin: config.clientUrl, credentials: true }));

// Logging
app.use(morgan('dev'));

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Root
app.get('/', (_req, res) => {
  res.json({ success: true, message: 'Hello World' });
});

// Routes
app.use('/api/v1', routes);

// 404 Not Found Handler - Must be before error handler
app.use(notFoundHandler);

// Global Error Handler - Must be last
app.use(errorHandler);

export default app;
