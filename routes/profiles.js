import { Router } from 'express';
import * as profilesController from '../controllers/profilesController.js';
import { requireLogin } from '../middleware/requireLogin.js';
import { asyncHandler } from '../asynchandler.js';

const router = Router();

router.get('/', asyncHandler(profilesController.index));
router.get('/search', asyncHandler(profilesController.index));
router.post('/', requireLogin, asyncHandler(profilesController.create));

router.delete('/:id', requireLogin, asyncHandler(profilesController.deleteProfile));

export default router;
