import { Router } from 'express';
import requireAuth from '../../middleware/auth.js';
import { singleFile, uploadImage } from '../../middleware/upload.js';
import { deleteMyPicture, getMyProfile, updateMyPicture, updateMyProfile } from './profile.controller.js';

const router = Router();

router.get('/profile', requireAuth, getMyProfile);
router.put('/profile', requireAuth, updateMyProfile);
router.put('/profile/picture', requireAuth, singleFile(uploadImage, 'picture'), updateMyPicture);
router.delete('/profile/picture', requireAuth, deleteMyPicture);

export default router;
