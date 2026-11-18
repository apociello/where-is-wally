import { Router } from 'express';
import { getMaps, getMap } from '../controllers/mapController.js';
import { createGame } from '../controllers/gameController.js';

const router = Router();

router.get('/', getMaps);
router.get('/:slug', getMap);
router.post('/:slug/games', createGame);

export default router;
