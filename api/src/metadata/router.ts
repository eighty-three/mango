import express from 'express';
import validator from '@utils/validator';
const router = express.Router();

import * as metadata from './controller';
import * as metadataSchema from './schema';

router.post('/notes/update',
  validator(metadataSchema.updateNotes, 'body'),
  metadata.updateNotes
);

router.get('/notes',
  metadata.getNotes
);

router.get('/id',
  metadata.getIDs
);

export default router;
