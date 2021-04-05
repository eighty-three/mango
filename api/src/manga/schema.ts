import Joi from '@hapi/joi';

const languages = ['cn', 'jp', 'kr', 'gb']; // gb = en
const pub_status = ['Ongoing', 'Complete', 'Hiatus', 'Cancelled']; // fix

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
  pub_status: Joi.string().valid(...pub_status)
});
