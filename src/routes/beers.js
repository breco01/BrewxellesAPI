// src/routes/beers.js
import { Router } from 'express';
import {
  listBeers,
  getBeer,
  createBeer,
  updateBeer,
  deleteBeer,
} from '../controllers/beersController.js';
import { body, param, query } from 'express-validator';
import { runValidation } from '../middleware/validate.js';

const router = Router();

// LIST
router.get(
  '/',
  [
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('limit 1..100'),
    query('offset').optional().isInt({ min: 0 }).withMessage('offset >= 0'),
    query('sort').optional().isIn(['name', 'abv', 'createdAt']).withMessage('invalid sort'),
    query('order').optional().isIn(['asc', 'desc']).withMessage('order asc|desc'),
    query('brewery').optional().isMongoId().withMessage('invalid brewery id'),
    query('populate').optional().isIn(['true', 'false']).withMessage('populate true|false'),
  ],
  runValidation,
  listBeers
);

// DETAILS
router.get(
  '/:id',
  [
    param('id').isMongoId().withMessage('Invalid ID format'),
    query('populate').optional().isIn(['true', 'false']).withMessage('populate true|false'),
  ],
  runValidation,
  getBeer
);

// CREATE
router.post(
  '/',
  [
    body('name').isString().trim().notEmpty().withMessage('name required'),
    body('style').isString().trim().notEmpty().withMessage('style required'),
    body('breweryId').isMongoId().withMessage('breweryId must be a valid id'),
    body('abv').isFloat({ min: 0, max: 20 }).withMessage('abv 0..20'),
    body('ibu').optional().isInt({ min: 0, max: 120 }).withMessage('ibu 0..120'),
    body('description').optional().isString(),
  ],
  runValidation,
  createBeer
);

// UPDATE
router.put(
  '/:id',
  [
    param('id').isMongoId().withMessage('Invalid ID format'),
    body('name').optional().isString().trim().notEmpty().withMessage('name non-empty'),
    body('style').optional().isString().trim().notEmpty().withMessage('style non-empty'),
    body('breweryId').optional().isMongoId().withMessage('breweryId invalid'),
    body('abv').optional().isFloat({ min: 0, max: 20 }).withMessage('abv 0..20'),
    body('ibu').optional().isInt({ min: 0, max: 120 }).withMessage('ibu 0..120'),
    body('description').optional().isString(),
  ],
  runValidation,
  updateBeer
);

// DELETE
router.delete(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid ID format')],
  runValidation,
  deleteBeer
);

export default router;
