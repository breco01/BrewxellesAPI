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
import authMiddleware from '../middleware/auth.js';

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
    query('style').optional().isString().trim().isLength({ min: 1, max: 50 }),
    query('q').optional().isString().trim().isLength({ min: 1, max: 100 }),
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

// CREATE (protected)
router.post(
  '/',
  authMiddleware,
  [
    body('name').isString().trim().isLength({ min: 2, max: 100 }).withMessage('name 2..100'),
    body('style').isString().trim().isLength({ min: 2, max: 50 }).withMessage('style 2..50'),
    body('breweryId').isMongoId().withMessage('breweryId must be a valid id'),
    body('abv').isFloat({ min: 0, max: 20 }).withMessage('abv 0..20'),
    body('ibu').optional().isInt({ min: 0, max: 120 }).withMessage('ibu 0..120'),
    body('description').optional().isString().isLength({ max: 500 }),
  ],
  runValidation,
  createBeer
);

// UPDATE (protected)
router.put(
  '/:id',
  authMiddleware,
  [
    param('id').isMongoId().withMessage('Invalid ID format'),
    body('name').optional().isString().trim().isLength({ min: 2, max: 100 }).withMessage('name 2..100'),
    body('style').optional().isString().trim().isLength({ min: 2, max: 50 }).withMessage('style 2..50'),
    body('breweryId').optional().isMongoId().withMessage('breweryId invalid'),
    body('abv').optional().isFloat({ min: 0, max: 20 }).withMessage('abv 0..20'),
    body('ibu').optional().isInt({ min: 0, max: 120 }).withMessage('ibu 0..120'),
    body('description').optional().isString().isLength({ max: 500 }),
  ],
  runValidation,
  updateBeer
);

// DELETE (protected)
router.delete(
  '/:id',
  authMiddleware,
  [param('id').isMongoId().withMessage('Invalid ID format')],
  runValidation,
  deleteBeer
);

export default router;
