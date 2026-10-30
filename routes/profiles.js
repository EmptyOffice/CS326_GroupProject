import { Router } from 'express';
import * as profilesController from '../controllers/profilesController.js';
import { asyncHandler } from '../asynchandler.js';

const router = Router();

router.get('/', asyncHandler(profilesController.index)); 

router.post('/', asyncHandler(profilesController.create));

export default router;