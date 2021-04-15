import express from 'express';
const router = express.Router();

// Routes
import mangaRouter from './manga/router';
router.use('/manga', mangaRouter);

import metadataRouter from './metadata/router';
router.use('/metadata', metadataRouter);

export default router;
