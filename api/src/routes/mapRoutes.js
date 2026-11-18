import { Router } from 'express';
import { getMaps, getMap, getLeaderboard } from '../controllers/mapController.js';
import { createGame } from '../controllers/gameController.js';

const router = Router();

router.get('/', getMaps);
router.get('/:slug', getMap);
router.get('/:slug/leaderboard', getLeaderboard);
router.post('/:slug/games', createGame);

export default router;
