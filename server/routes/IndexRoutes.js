import { Router } from "express";
import AuthRoutes from './AuthRoutes.js';
import MessageRoutes from './MessageRoutes.js';

const router = Router();

router.use('/auth', AuthRoutes);
router.use('/message', MessageRoutes);

export default router;
