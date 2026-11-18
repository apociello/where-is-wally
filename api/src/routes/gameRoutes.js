import { Router } from 'express';
import { createGuess, saveName } from '../controllers/gameController.js';

const router = Router();

router.post('/:gameId/guesses', createGuess);
router.patch('/:gameId', saveName);

export default router;
