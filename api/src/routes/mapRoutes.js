import { Router } from 'express';
import { getMap } from '../controllers/mapController.js';

const router = Router();

router.get('/:slug', getMap);

export default router;
