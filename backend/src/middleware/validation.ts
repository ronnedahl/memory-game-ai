import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { ValidationError } from '../types/errors';

export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      
      throw new ValidationError(
        `Validation failed: ${errors.map(e => e.message).join(', ')}`
      );
    }
    
    next();
  };
};

// Game validation schemas
export const createGameSchema = Joi.object({
  difficulty: Joi.string()
    .valid('easy', 'medium', 'hard')
    .required()
    .messages({
      'any.required': 'Difficulty is required',
      'any.only': 'Difficulty must be one of: easy, medium, hard'
    }),
  theme: Joi.string()
    .min(2)
    .max(50)
    .optional()
    .messages({
      'string.min': 'Theme must be at least 2 characters',
      'string.max': 'Theme must not exceed 50 characters'
    })
});

export const submitGameSchema = Joi.object({
  selectedImageIds: Joi.array()
    .items(Joi.string().uuid())
    .min(0)
    .required()
    .messages({
      'array.base': 'Selected image IDs must be an array',
      'any.required': 'Selected image IDs are required'
    }),
  timeSpent: Joi.number()
    .integer()
    .min(0)
    .required()
    .messages({
      'number.base': 'Time spent must be a number',
      'number.min': 'Time spent cannot be negative',
      'any.required': 'Time spent is required'
    })
});