import express from 'express';
const router = express.Router();

// Routes
import mangaRouter from './manga/router';
router.use('/manga', mangaRouter);

export default router;
