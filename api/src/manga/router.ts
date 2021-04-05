import express from 'express';
import validator from '@utils/validator';
const router = express.Router();

import * as manga from './controller';
import * as mangaSchema from './schema';

router.get('/series/random',
  manga.getRandomSeries
);

router.get('/series/:id',
  validator(mangaSchema.getSeries, 'params'),
  manga.getSeries
);

router.post('/series/search/title',
  validator(mangaSchema.searchTitle, 'body'),
  manga.searchTitle
);

router.post('/series/search/metadata',
  validator(mangaSchema.searchMetadata, 'body'),
  manga.searchMetadata
);

export default router;
