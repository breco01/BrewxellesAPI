import { Router } from 'express';
import {
  listBeers,
  getBeer,
  createBeer,
  updateBeer,
  deleteBeer,
} from '../controllers/beersController.js';

const router = Router();

router.get('/', listBeers);
router.get('/:id', getBeer);
router.post('/', createBeer);
router.put('/:id', updateBeer);
router.delete('/:id', deleteBeer);

export default router;
