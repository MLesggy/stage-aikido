const express = require('express');
const router = express.Router();
const storiesController = require('../controllers/stories.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Routes pour les stories
router.get('/', storiesController.getAllStories);
router.get('/:id', storiesController.getStoryById);
router.post('/', authMiddleware, storiesController.createStory);
router.put('/:id', authMiddleware, storiesController.updateStory);
router.delete('/:id', authMiddleware, storiesController.deleteStory);

module.exports = router;