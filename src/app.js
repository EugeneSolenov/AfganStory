const express = require('express');
const path = require('path');
const avatarRoutes = require('./routes/avatarRoutes');
const logger = require('./middleware/logger');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/api/avatars', avatarRoutes);

// Запуск сервера
app.listen(PORT, () => {
  console.log(`✅ Сервер запущен на http://localhost:${PORT}`);
  console.log(`📁 Статические файлы доступны в папке /public`);
});