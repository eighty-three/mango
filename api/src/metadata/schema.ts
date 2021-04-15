import Joi from '@hapi/joi';

export const updateNotes = Joi.object({
  md_id: Joi.number().required(),
  notes: Joi.string().allow('', null).required()
});
