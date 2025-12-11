// Генератор аватаров на Canvas
class AvatarGenerator {
    constructor() {
        this.canvas = document.getElementById('avatarCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.scale = 1;
        this.rotation = 0;
        
        // Цветовые палитры
        this.colorPalettes = {
            bright: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#FFA07A', '#9370DB'],
            pastel: ['#FFB6C1', '#87CEEB', '#98FB98', '#DDA0DD', '#FFD700', '#F0E68C', '#E6E6FA', '#FFDEAD'],
            monochrome: ['#2C3E50', '#34495E', '#7F8C8D', '#95A5A6', '#BDC3C7', '#ECF0F1', '#FFFFFF', '#000000'],
            nature: ['#27AE60', '#2ECC71', '#3498DB', '#2980B9', '#8E44AD', '#9B59B6', '#E74C3C', '#C0392B'],
            random: this.generateRandomPalette()
        };
    }

    // Простая хэш-функция
    hashString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) - hash) + str.charCodeAt(i);
            hash = hash & hash;
        }
        return Math.abs(hash);
    }

    // Генерация случайной палитры
    generateRandomPalette() {
        const colors = [];
        for (let i = 0; i < 8; i++) {
            colors.push('#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'));
        }
        return colors;
    }

    // Получение цвета из палитры на основе хэша
    getColorFromPalette(paletteName, hash, index = 0) {
        const palette = this.colorPalettes[paletteName] || this.colorPalettes.bright;
        return palette[(hash + index) % palette.length];
    }

    // Очистка canvas
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // Сохранение состояния canvas
    saveContext() {
        this.ctx.save();
        this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.scale(this.scale, this.scale);
        this.ctx.rotate(this.rotation * Math.PI / 180);
        this.ctx.translate(-this.canvas.width / 2, -this.canvas.height / 2);
    }

    // Восстановление состояния canvas
    restoreContext() {
        this.ctx.restore();
    }

    // Отрисовка фона
    drawBackground(hash, paletteName) {
        const bgColor = this.getColorFromPalette(paletteName, hash, 0);
        this.ctx.fillStyle = bgColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // Отрисовка круга
    drawCircle(x, y, radius, color, opacity = 1) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.fillStyle = color;
        this.ctx.globalAlpha = opacity;
        this.ctx.fill();
        this.ctx.globalAlpha = 1;
    }

    // Отрисовка квадрата
    drawSquare(x, y, size, color, opacity = 1) {
        this.ctx.fillStyle = color;
        this.ctx.globalAlpha = opacity;
        this.ctx.fillRect(x - size/2, y - size/2, size, size);
        this.ctx.globalAlpha = 1;
    }

    // Отрисовка треугольника
    drawTriangle(x, y, size, color, opacity = 1) {
        this.ctx.beginPath();
        this.ctx.moveTo(x, y - size);
        this.ctx.lineTo(x - size, y + size);
        this.ctx.lineTo(x + size, y + size);
        this.ctx.closePath();
        this.ctx.fillStyle = color;
        this.ctx.globalAlpha = opacity;
        this.ctx.fill();
        this.ctx.globalAlpha = 1;
    }

    // Отрисовка шестиугольника
    drawHexagon(x, y, size, color, opacity = 1) {
        this.ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3;
            const px = x + size * Math.cos(angle);
            const py = y + size * Math.sin(angle);
            if (i === 0) {
                this.ctx.moveTo(px, py);
            } else {
                this.ctx.lineTo(px, py);
            }
        }
        this.ctx.closePath();
        this.ctx.fillStyle = color;
        this.ctx.globalAlpha = opacity;
        this.ctx.fill();
        this.ctx.globalAlpha = 1;
    }

    // Генерация случайной фигуры
    drawRandomShape(x, y, size, color, hash, index) {
        const shapeType = (hash + index) % 4;
        
        switch(shapeType) {
            case 0:
                this.drawCircle(x, y, size/2, color, 0.8 + (hash % 20) / 100);
                break;
            case 1:
                this.drawSquare(x, y, size, color, 0.7 + (hash % 30) / 100);
                break;
            case 2:
                this.drawTriangle(x, y, size/1.5, color, 0.6 + (hash % 40) / 100);
                break;
            case 3:
                this.drawHexagon(x, y, size/2.5, color, 0.9 + (hash % 10) / 100);
                break;
        }
    }

    // Генерация аватара
    generateAvatar(seed, size = 200, complexity = 8, colorTheme = 'bright', shapeType = 'circles') {
        const hash = this.hashString(seed);
        const actualSize = Math.min(size, 400);
        
        // Устанавливаем размер canvas
        this.canvas.width = actualSize;
        this.canvas.height = actualSize;
        
        // Сохраняем контекст для трансформаций
        this.saveContext();
        
        // Очищаем canvas
        this.clearCanvas();
        
        // Рисуем фон
        this.drawBackground(hash, colorTheme);
        
        // Генерируем фигуры
        const numShapes = complexity;
        const usedColors = new Set();
        
        for (let i = 0; i < numShapes; i++) {
            const shapeHash = this.hashString(seed + i.toString());
            
            // Генерируем позицию
            const x = (shapeHash * 13) % actualSize;
            const y = (shapeHash * 17) % actualSize;
            
            // Генерируем размер
            const shapeSize = 10 + (shapeHash % (actualSize / 3));
            
            // Получаем цвет
            const color = this.getColorFromPalette(colorTheme, shapeHash, i);
            usedColors.add(color);
            
            // Рисуем фигуру в зависимости от типа
            switch(shapeType) {
                case 'circles':
                    this.drawCircle(x, y, shapeSize/2, color, 0.8 + (shapeHash % 20) / 100);
                    break;
                case 'squares':
                    this.drawSquare(x, y, shapeSize, color, 0.7 + (shapeHash % 30) / 100);
                    break;
                case 'triangles':
                    this.drawTriangle(x, y, shapeSize/1.5, color, 0.6 + (shapeHash % 40) / 100);
                    break;
                case 'mixed':
                    this.drawRandomShape(x, y, shapeSize, color, shapeHash, i);
                    break;
            }
        }
        
        // Восстанавливаем контекст
        this.restoreContext();
        
        // Возвращаем информацию об аватаре
        return {
            hash: hash.toString(16).substring(0, 6).toUpperCase(),
            colors: Array.from(usedColors),
            shapes: numShapes,
            size: `${actualSize}x${actualSize}`,
            seed: seed
        };
    }

    // Получение данных canvas в формате Data URL
    getDataURL() {
        return this.canvas.toDataURL('image/png');
    }

    // Скачивание аватара
    downloadAvatar(filename = 'avatar.png') {
        const link = document.createElement('a');
        link.download = filename;
        link.href = this.getDataURL();
        link.click();
    }

    // Копирование аватара в буфер обмена
    async copyToClipboard() {
        try {
            // Получаем Blob из canvas
            this.canvas.toBlob(async (blob) => {
                try {
                    await navigator.clipboard.write([
                        new ClipboardItem({
                            'image/png': blob
                        })
                    ]);
                    return true;
                } catch (err) {
                    console.error('Ошибка копирования:', err);
                    return false;
                }
            }, 'image/png');
        } catch (err) {
            console.error('Ошибка:', err);
            return false;
        }
    }

    // Изменение масштаба
    zoom(factor) {
        this.scale *= factor;
        this.scale = Math.max(0.5, Math.min(3, this.scale));
        this.redraw();
    }

    // Поворот
    rotate(degrees) {
        this.rotation += degrees;
        this.redraw();
    }

    // Сброс трансформаций
    reset() {
        this.scale = 1;
        this.rotation = 0;
        this.redraw();
    }

    // Перерисовка с текущими параметрами
    redraw() {
        const seed = document.getElementById('seed').value || 'Avatar';
        const size = parseInt(document.getElementById('size').value);
        const complexity = parseInt(document.getElementById('complexity').value);
        const colorTheme = document.getElementById('colorTheme').value;
        const shapeType = document.getElementById('shapeType').value;
        
        this.generateAvatar(seed, size, complexity, colorTheme, shapeType);
    }

    // Создание миниатюры для галереи
    createThumbnailCanvas(width = 150, height = 150) {
        const thumbnailCanvas = document.createElement('canvas');
        thumbnailCanvas.width = width;
        thumbnailCanvas.height = height;
        const thumbnailCtx = thumbnailCanvas.getContext('2d');
        
        // Копируем основной canvas в миниатюру
        thumbnailCtx.drawImage(this.canvas, 0, 0, width, height);
        
        return thumbnailCanvas;
    }
}

// Создаем глобальный экземпляр генератора
window.avatarGenerator = new AvatarGenerator();