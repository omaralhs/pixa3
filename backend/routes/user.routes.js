import express from 'express';
import { insertUser, getUser, joiningGame } from '../controllers/user.controller.js';

const router = express.Router();

router.post('/inserUser', insertUser);
router.get('/getUser', getUser);
router.get('/joining_game', joiningGame);

export default router;
