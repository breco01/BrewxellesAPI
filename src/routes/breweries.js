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

// LIST
router.get(
  '/',
  [
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('limit 1..100'),
    query('offset').optional().isInt({ min: 0 }).withMessage('offset >= 0'),
    query('sort').optional().isIn(['name', 'city', 'createdAt']).withMessage('invalid sort'),
    query('order').optional().isIn(['asc', 'desc']).withMessage('order asc|desc'),
    query('q').optional().isString().trim().isLength({ min: 1, max: 100 })
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
    body('name').isString().trim().isLength({ min: 2, max: 100 }).withMessage('name 2..100'),
    body('city').isString().trim().isLength({ min: 2, max: 100 }).withMessage('city 2..100'),
    body('website')
      .optional()
      .isURL({ protocols: ['https'], require_protocol: true })
      .withMessage('website must be https URL'),
    body('contactFirstName').optional().isString().trim().isLength({ max: 50 }).matches(/^[^\d]*$/).withMessage('no digits allowed')
  ],
  runValidation,
  createBrewery
);

// UPDATE
router.put(
  '/:id',
  [
    param('id').isMongoId().withMessage('Invalid ID format'),
    body('name').optional().isString().trim().isLength({ min: 2, max: 100 }).withMessage('name 2..100'),
    body('city').optional().isString().trim().isLength({ min: 2, max: 100 }).withMessage('city 2..100'),
    body('website')
      .optional()
      .isURL({ protocols: ['https'], require_protocol: true })
      .withMessage('website must be https URL'),
    body('contactFirstName').optional().isString().trim().isLength({ max: 50 }).matches(/^[^\d]*$/).withMessage('no digits allowed')
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