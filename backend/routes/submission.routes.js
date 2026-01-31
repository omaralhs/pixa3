import express from 'express';
import {
  getSubs,
  getTrys,
  saveSubmission,
  getTopPlayers
} from '../controllers/submission.controller.js';

const router = express.Router();

router.post('/GetSubs', getSubs);
router.get('/gettrys', getTrys);
router.post('/Save', saveSubmission);
router.get('/gettopplayers/:game_id', getTopPlayers);

export default router;
