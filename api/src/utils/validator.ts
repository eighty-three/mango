import { Request, RequestHandler } from 'express';
import logger from '@utils/logger';
import { errorResponse } from './validator.types';


const validator = (schema: any, property: keyof Request): RequestHandler => {
  return (req, res, next): void | errorResponse => {
    const { error } = schema.validate(req[property]);
    if (error == null) {
      next();
    } else {
      logger.error(error);
      res.status(400).json({ error: 'Bad Request', statusCode: 400 });
    }
  };
};

export default validator;
