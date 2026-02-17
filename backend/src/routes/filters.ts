import { Router } from 'express';
import {
  getDomains,
  getRarities,
  getTypes,
  getArtists,
  getExpansions,
} from '../controllers/filterController';

const router = Router();

router.get('/domains', getDomains);
router.get('/rarities', getRarities);
router.get('/types', getTypes);
router.get('/artists', getArtists);
router.get('/expansions', getExpansions);

export { router as filterRouter };
