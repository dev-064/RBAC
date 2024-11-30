import express, { Router } from 'express';
import { getModeratorRequests, handleModeratorRequest } from '../controllers/adminController';
import { auth } from '../middlewares/auth';
import { checkAdmin } from '../middlewares/checkAdmin';

const router: Router = express.Router();

router.get('/getModeratorRequests', auth, checkAdmin, getModeratorRequests);
router.post('/handleModeratorRequest', auth, checkAdmin, handleModeratorRequest);

export default router;
