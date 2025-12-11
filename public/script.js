document.addEventListener('DOMContentLoaded', function() {
    // Элементы управления
    const generateBtn = document.getElementById('generateBtn');
    const randomBtn = document.getElementById('randomBtn');
    const saveBtn = document.getElementById('saveBtn');
    const seedInput = document.getElementById('seed');
    const sizeSlider = document.getElementById('size');
    const complexitySlider = document.getElementById('complexity');
    const colorThemeSelect = document.getElementById('colorTheme');
    const shapeTypeSelect = document.getElementById('shapeType');
    
    // Элементы отображения
    const sizeValue = document.getElementById('sizeValue');
    const complexityValue = document.getElementById('complexityValue');
    const hashValue = document.getElementById('hashValue');
    const shapesCount = document.getElementById('shapesCount');
    const canvasSize = document.getElementById('canvasSize');
    const colorsPreview = document.getElementById('colorsPreview');
    
    // Кнопки canvas
    const zoomInBtn = document.getElementById('zoomInBtn');
    const zoomOutBtn = document.getElementById('zoomOutBtn');
    const rotateBtn = document.getElementById('rotateBtn');
    const resetBtn = document.getElementById('resetBtn');
    
    // Кнопки действий
    const copyImageBtn = document.getElementById('copyImageBtn');
    const shareLinkBtn = document.getElementById('shareLinkBtn');
    
    // Галерея
    const galleryContainer = document.getElementById('galleryContainer');
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');
    const saveAllBtn = document.getElementById('saveAllBtn');
    
    // Модальное окно
    const copyModal = document.getElementById('copyModal');
    const closeModalBtn = document.querySelector('.close-modal');
    const modalOkBtn = document.getElementById('modalOkBtn');
    
    // История аватаров
    let avatarHistory = JSON.parse(localStorage.getItem('avatarHistory') || '[]');
    const MAX_HISTORY = 20;
    
    // Генерация случайного seed
    function generateRandomSeed() {
        const adjectives = ['быстрый', 'умный', 'яркий', 'тихий', 'смелый', 'веселый', 'горячий', 'холодный', 'летающий', 'плавающий'];
        const nouns = ['тигр', 'орел', 'дельфин', 'волк', 'леопард', 'феникс', 'дракон', 'единорог', 'сапсан', 'колибри'];
        const numbers = Math.floor(Math.random() * 10000);
        
        const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
        const noun = nouns[Math.floor(Math.random() * nouns.length)];
        
        return `${adj}_${noun}_${numbers}`;
    }
    
    // Показать уведомление
    function showNotification(message, type = 'success') {
        // Удаляем существующие уведомления
        document.querySelectorAll('.notification').forEach(n => n.remove());
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i> ${message}`;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideIn 0.3s ease-in reverse';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    // Обновление предпросмотра цветов
    function updateColorsPreview(colors) {
        colorsPreview.innerHTML = '';
        colors.slice(0, 5).forEach(color => {
            const colorDot = document.createElement('span');
            colorDot.className = 'color-dot';
            colorDot.style.backgroundColor = color;
            colorDot.title = color;
            colorsPreview.appendChild(colorDot);
        });
    }
    
    // Генерация аватара
    function generateAvatar() {
        const seed = seedInput.value.trim() || 'Avatar';
        const size = parseInt(sizeSlider.value);
        const complexity = parseInt(complexitySlider.value);
        const colorTheme = colorThemeSelect.value;
        const shapeType = shapeTypeSelect.value;
        
        // Генерируем аватар
        const avatarInfo = window.avatarGenerator.generateAvatar(
            seed, size, complexity, colorTheme, shapeType
        );
        
        // Обновляем информацию
        hashValue.textContent = avatarInfo.hash;
        shapesCount.textContent = avatarInfo.shapes;
        canvasSize.textContent = avatarInfo.size;
        updateColorsPreview(avatarInfo.colors);
        
        // Сохраняем в историю
        saveToHistory(avatarInfo);
        
        // Обновляем галерею
        updateGallery();
        
        showNotification('Аватар создан!');
    }
    
    // Сохранение в историю
    function saveToHistory(avatarInfo) {
        // Добавляем timestamp
        avatarInfo.timestamp = new Date().toISOString();
        avatarInfo.dataURL = window.avatarGenerator.getDataURL();
        
        // Добавляем в начало массива
        avatarHistory.unshift(avatarInfo);
        
        // Ограничиваем размер истории
        if (avatarHistory.length > MAX_HISTORY) {
            avatarHistory = avatarHistory.slice(0, MAX_HISTORY);
        }
        
        // Сохраняем в localStorage
        localStorage.setItem('avatarHistory', JSON.stringify(avatarHistory));
    }
    
    // Обновление галереи
    function updateGallery() {
        galleryContainer.innerHTML = '';
        
        if (avatarHistory.length === 0) {
            const emptyDiv = document.createElement('div');
            emptyDiv.className = 'empty-gallery';
            emptyDiv.innerHTML = `
                <i class="fas fa-images"></i>
                <p>Созданные аватары появятся здесь</p>
            `;
            galleryContainer.appendChild(emptyDiv);
            return;
        }
        
        avatarHistory.forEach((avatar, index) => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            galleryItem.dataset.index = index;
            
            // Создаем миниатюру
            const canvas = document.createElement('canvas');
            canvas.width = 150;
            canvas.height = 150;
            const ctx = canvas.getContext('2d');
            
            // Загружаем изображение для миниатюры
            const img = new Image();
            img.onload = function() {
                ctx.drawImage(img, 0, 0, 150, 150);
            };
            img.src = avatar.dataURL;
            
            galleryItem.innerHTML = `
                <canvas width="150" height="150"></canvas>
                <div class="gallery-info">
                    <div class="gallery-seed" title="${avatar.seed}">
                        ${avatar.seed.length > 15 ? avatar.seed.substring(0, 15) + '...' : avatar.seed}
                    </div>
                    <div class="gallery-size">
                        ${avatar.size} • ${new Date(avatar.timestamp).toLocaleDateString()}
                    </div>
                </div>
            `;
            
            // Заменяем пустой canvas на загруженный
            setTimeout(() => {
                const itemCanvas = galleryItem.querySelector('canvas');
                if (itemCanvas) {
                    const itemCtx = itemCanvas.getContext('2d');
                    const img = new Image();
                    img.onload = function() {
                        itemCtx.drawImage(img, 0, 0, 150, 150);
                    };
                    img.src = avatar.dataURL;
                }
            }, 100);
            
            // Обработчик клика для восстановления аватара
            galleryItem.addEventListener('click', () => {
                seedInput.value = avatar.seed;
                generateAvatar();
            });
            
            galleryContainer.appendChild(galleryItem);
        });
    }
    
    // Сохранение аватара
    function saveAvatar() {
        const seed = seedInput.value.trim() || 'avatar';
        const filename = `avatar_${seed}_${Date.now()}.png`;
        window.avatarGenerator.downloadAvatar(filename);
        showNotification('Аватар сохранен!');
    }
    
    // Копирование аватара в буфер обмена
    async function copyAvatar() {
        try {
            const success = await window.avatarGenerator.copyToClipboard();
            if (success) {
                copyModal.style.display = 'flex';
                setTimeout(() => {
                    copyModal.style.display = 'none';
                }, 3000);
            } else {
                showNotification('Не удалось скопировать аватар', 'error');
            }
        } catch (error) {
            console.error('Ошибка копирования:', error);
            showNotification('Браузер не поддерживает копирование изображений', 'error');
        }
    }
    
    // Очистка истории
    function clearHistory() {
        if (confirm('Вы уверены, что хотите очистить историю аватаров?')) {
            avatarHistory = [];
            localStorage.removeItem('avatarHistory');
            updateGallery();
            showNotification('История очищена');
        }
    }
    
    // Сохранение всех аватаров
    function saveAllAvatars() {
        if (avatarHistory.length === 0) {
            showNotification('Нет аватаров для сохранения', 'error');
            return;
        }
        
        avatarHistory.forEach((avatar, index) => {
            setTimeout(() => {
                const link = document.createElement('a');
                link.download = `avatar_${avatar.seed}_${index}.png`;
                link.href = avatar.dataURL;
                link.click();
            }, index * 100);
        });
        
        showNotification(`Сохранено ${avatarHistory.length} аватаров`);
    }
    
    // Инициализация
    function init() {
        // Установка значений по умолчанию
        sizeValue.textContent = sizeSlider.value;
        complexityValue.textContent = complexitySlider.value;
        
        // Генерация первого аватара
        generateAvatar();
        
        // Загрузка истории
        updateGallery();
        
        // Настройка обработчиков событий
        generateBtn.addEventListener('click', generateAvatar);
        
        randomBtn.addEventListener('click', () => {
            seedInput.value = generateRandomSeed();
            colorThemeSelect.value = 'random';
            generateAvatar();
        });
        
        saveBtn.addEventListener('click', saveAvatar);
        
        copyImageBtn.addEventListener('click', copyAvatar);
        
        shareLinkBtn.addEventListener('click', () => {
            const seed = seedInput.value.trim() || 'avatar';
            const avatarData = window.avatarGenerator.getDataURL();
            
            if (navigator.share) {
                navigator.share({
                    title: `Мой аватар: ${seed}`,
                    text: 'Посмотрите на созданный мной аватар!',
                    url: avatarData
                }).catch(err => {
                    if (err.name !== 'AbortError') {
                        showNotification('Не удалось поделиться', 'error');
                    }
                });
            } else {
                // Альтернатива для браузеров без поддержки Web Share API
                const tempInput = document.createElement('input');
                tempInput.value = avatarData;
                document.body.appendChild(tempInput);
                tempInput.select();
                document.execCommand('copy');
                document.body.removeChild(tempInput);
                showNotification('Ссылка на аватар скопирована');
            }
        });
        
        // Слайдеры
        sizeSlider.addEventListener('input', function() {
            sizeValue.textContent = this.value;
            generateAvatar();
        });
        
        complexitySlider.addEventListener('input', function() {
            complexityValue.textContent = this.value;
            generateAvatar();
        });
        
        // Выпадающие списки
        colorThemeSelect.addEventListener('change', generateAvatar);
        shapeTypeSelect.addEventListener('change', generateAvatar);
        
        // Поле ввода
        seedInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                generateAvatar();
            }
        });
        
        // Кнопки canvas
        zoomInBtn.addEventListener('click', () => {
            window.avatarGenerator.zoom(1.2);
        });
        
        zoomOutBtn.addEventListener('click', () => {
            window.avatarGenerator.zoom(0.8);
        });
        
        rotateBtn.addEventListener('click', () => {
            window.avatarGenerator.rotate(90);
        });
        
        resetBtn.addEventListener('click', () => {
            window.avatarGenerator.reset();
        });
        
        // Галерея
        clearHistoryBtn.addEventListener('click', clearHistory);
        saveAllBtn.addEventListener('click', saveAllAvatars);
        
        // Модальное окно
        closeModalBtn.addEventListener('click', () => {
            copyModal.style.display = 'none';
        });
        
        modalOkBtn.addEventListener('click', () => {
            copyModal.style.display = 'none';
        });
        
        copyModal.addEventListener('click', (e) => {
            if (e.target === copyModal) {
                copyModal.style.display = 'none';
            }
        });
        
        // Автоматическое обновление при изменении размера окна
        window.addEventListener('resize', () => {
            setTimeout(generateAvatar, 100);
        });
    }
    
    // Запуск приложения
    init();
});