import express from 'express';
import {
  startGame,
  checkGameStarted,
  createGame,
  joinGame,
  getImageNumber,
  nextImage,
  getGameImages,
  getGameUsers
} from '../controllers/game.controller.js';

const router = express.Router();

router.post('/start_game', startGame);
router.get('/check_game_started', checkGameStarted);
router.post('/creategame', createGame);
router.post('/join_game', joinGame);
router.get('/image-number', getImageNumber);
router.post('/next-image', nextImage);
router.get('/game-images', getGameImages);
router.get('/gameusers', getGameUsers);

export default router;
