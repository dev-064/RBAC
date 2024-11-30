import express, { Router } from 'express';
import { getAllReports, createReport, updateReport, deleteReport, addComment, deleteComment } from '../controllers/reportController';
import { auth } from '../middlewares/auth';
import { checkModerator } from '../middlewares/checkModerator';

const router: Router = express.Router();

router.get('/', auth, getAllReports);
router.post('/', auth, checkModerator, createReport);
router.put('/:id', auth, checkModerator, updateReport);
router.delete('/:id', auth, checkModerator, deleteReport);
router.post('/:id/comments', auth, addComment);
router.delete('/:id/comments/:commentId', auth, deleteComment);

export default router;
