import express from 'express';
import { chat, generateAIImage, getImages } from '../controllers/ai.controller.js';

const router = express.Router();

router.post('/chat', chat);
router.post('/gen', generateAIImage);
router.get('/getimages', getImages);

export default router;
