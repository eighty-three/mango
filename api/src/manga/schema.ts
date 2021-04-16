import Joi from '@hapi/joi';

const languages = ['cn', 'jp', 'kr', 'gb', 'hk']; // gb = en
const publication = ['ongoing', 'complete', 'hiatus', 'cancelled'];
const reading = ['dropped', 'completed', 'reading', 'null'];
const downloaded = ['complete', 'incomplete', 'none', 'null'];

export const getSeries = Joi.object({
  id: Joi.number().required()
});

export const searchTitle = Joi.object({
  str: Joi.string().required()
});

export const searchMetadata = Joi.object({
  title: Joi.string(),
  author: Joi.string(),
  artist: Joi.string(),
  language: Joi.string().valid(...languages),
  publication: Joi.string().valid(...publication),
  reading: Joi.string().valid(...reading),
  downloaded: Joi.string().valid(...downloaded),
  from_md: Joi.boolean(),
  page: Joi.number(),
});
