const express = require('express');
const router = express.Router();
const avatarController = require('../controllers/avatarController');

// POST /api/avatars/save - сохранение аватара
router.post('/save', avatarController.saveAvatar);

// GET /api/avatars/history - история аватаров
router.get('/history', avatarController.getHistory);

// GET /api/avatars/:id - получение аватара по ID
router.get('/:id', avatarController.getAvatarById);

// GET /api/avatars/generate/simple - простая генерация информации
router.get('/generate/simple', avatarController.generateSimpleAvatar);

module.exports = router;