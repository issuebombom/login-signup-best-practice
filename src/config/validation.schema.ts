import * as Joi from '@hapi/joi';

export const validationSchema = Joi.object({
  ENV: Joi.string().valid('local', 'dev', 'prod').required(),

  JWT_SECRET: Joi.string().required(),

  HOST: Joi.string().required(),
  PORT: Joi.number().required(),

  // DB
  DB_TYPE: Joi.string().required(),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_DATABASE: Joi.string().required(),
});
