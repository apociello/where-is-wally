import { Router } from 'express';
import { createGuess } from '../controllers/gameController.js';

const router = Router();

router.post('/:gameId/guesses', createGuess);

export default router;
