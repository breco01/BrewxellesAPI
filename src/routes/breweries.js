import { Router } from 'express';
import {
  listBreweries,
  getBrewery,
  createBrewery,
  updateBrewery,
  deleteBrewery,
} from '../controllers/breweriesController.js';

const router = Router();

router.get('/', listBreweries);
router.get('/:id', getBrewery);
router.post('/', createBrewery);
router.put('/:id', updateBrewery);
router.delete('/:id', deleteBrewery);

export default router;
