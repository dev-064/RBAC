import express, { Router } from 'express';
import { testApi } from '../controllers/testController';

const router: Router = express.Router();

router.get('/', testApi);

export default router;
