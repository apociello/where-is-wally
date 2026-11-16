import { Router } from 'express';
import { getMap } from '../controllers/mapController.js';
import { createGame } from '../controllers/gameController.js';

const router = Router();

router.get('/:slug', getMap);
router.post('/:slug/games', createGame);

export default router;
