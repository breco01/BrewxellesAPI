// src/routes/breweries.js
import { Router } from 'express';
import {
  listBreweries,
  getBrewery,
  createBrewery,
  updateBrewery,
  deleteBrewery,
} from '../controllers/breweriesController.js';
import { body, param, query } from 'express-validator';
import { runValidation } from '../middleware/validate.js';

const router = Router();

// LIST: ?limit, ?offset, ?q, ?sort, ?order
router.get(
  '/',
  [
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('limit 1..100'),
    query('offset').optional().isInt({ min: 0 }).withMessage('offset >= 0'),
    query('sort').optional().isIn(['name', 'city,', 'createdAt', 'name', 'city']).withMessage('invalid sort'),
    query('order').optional().isIn(['asc', 'desc']).withMessage('order asc|desc'),
  ],
  runValidation,
  listBreweries
);

// DETAILS
router.get(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid ID format')],
  runValidation,
  getBrewery
);

// CREATE
router.post(
  '/',
  [
    body('name').isString().trim().notEmpty().withMessage('name required'),
    body('city').isString().trim().notEmpty().withMessage('city required'),
    body('website').optional().isURL({ require_protocol: false }).withMessage('invalid website'),
    body('contactFirstName').optional().matches(/^[^\d]*$/).withMessage('no digits allowed'),
  ],
  runValidation,
  createBrewery
);

// UPDATE
router.put(
  '/:id',
  [
    param('id').isMongoId().withMessage('Invalid ID format'),
    body('name').optional().isString().trim().notEmpty().withMessage('name must be non-empty'),
    body('city').optional().isString().trim().notEmpty().withMessage('city must be non-empty'),
    body('website').optional().isURL({ require_protocol: false }).withMessage('invalid website'),
    body('contactFirstName').optional().matches(/^[^\d]*$/).withMessage('no digits allowed'),
  ],
  runValidation,
  updateBrewery
);

// DELETE
router.delete(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid ID format')],
  runValidation,
  deleteBrewery
);

export default router;
