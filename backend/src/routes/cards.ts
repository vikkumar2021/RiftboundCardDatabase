import { Router } from 'express';
import { getCards, getCardById, searchCards } from '../controllers/cardController';

const router = Router();

router.get('/', getCards);
router.get('/search', searchCards);
router.get('/:id', getCardById);

export { router as cardRouter };
