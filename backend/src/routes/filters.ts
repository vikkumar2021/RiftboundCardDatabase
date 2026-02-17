import { Router } from 'express';
import {
  getFactions,
  getRarities,
  getTypes,
  getKeywords,
  getSets,
} from '../controllers/filterController';

const router = Router();

router.get('/factions', getFactions);
router.get('/rarities', getRarities);
router.get('/types', getTypes);
router.get('/keywords', getKeywords);
router.get('/sets', getSets);

export { router as filterRouter };
