class AvatarController {
    constructor() {
        this.generatedAvatars = [];
        this.history = [];
    }

    // Сохранение информации об аватаре (без генерации изображения)
    saveAvatar(req, res) {
        try {
            const { seed, size, complexity, colorTheme, shapeType, dataURL } = req.body;
            
            const avatar = {
                id: Date.now(),
                seed: seed || 'unknown',
                size: size || 200,
                complexity: complexity || 8,
                colorTheme: colorTheme || 'bright',
                shapeType: shapeType || 'circles',
                dataURL: dataURL,
                createdAt: new Date().toISOString()
            };
            
            this.generatedAvatars.unshift(avatar);
            
            if (this.generatedAvatars.length > 50) {
                this.generatedAvatars.pop();
            }
            
            res.json({
                success: true,
                message: 'Аватар сохранен',
                data: avatar
            });
            
        } catch (error) {
            console.error('Ошибка сохранения:', error);
            res.status(500).json({
                success: false,
                message: 'Ошибка при сохранении аватара',
                error: error.message
            });
        }
    }

    // Получение истории аватаров
    getHistory(req, res) {
        const recent = this.generatedAvatars.slice(0, 20).map(avatar => ({
            id: avatar.id,
            seed: avatar.seed,
            size: avatar.size,
            complexity: avatar.complexity,
            colorTheme: avatar.colorTheme,
            shapeType: avatar.shapeType,
            createdAt: avatar.createdAt
        }));
        
        res.json({
            success: true,
            count: recent.length,
            data: recent
        });
    }

    // Получение аватара по ID
    getAvatarById(req, res) {
        const { id } = req.params;
        const avatar = this.generatedAvatars.find(a => a.id == id);
        
        if (avatar) {
            res.json({
                success: true,
                data: {
                    id: avatar.id,
                    seed: avatar.seed,
                    size: avatar.size,
                    complexity: avatar.complexity,
                    colorTheme: avatar.colorTheme,
                    shapeType: avatar.shapeType,
                    createdAt: avatar.createdAt,
                    dataURL: avatar.dataURL
                }
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Аватар не найден'
            });
        }
    }

    // Генерация простого аватара для API
    generateSimpleAvatar(req, res) {
        try {
            const { seed, size = 200 } = req.query;
            
            // Простая хэш-функция для примера
            function hashString(str) {
                let hash = 0;
                for (let i = 0; i < str.length; i++) {
                    hash = ((hash << 5) - hash) + str.charCodeAt(i);
                    hash = hash & hash;
                }
                return Math.abs(hash);
            }
            
            const hash = hashString(seed || Date.now().toString());
            const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];
            const color = colors[hash % colors.length];
            
            const avatar = {
                id: Date.now(),
                seed: seed || 'random',
                size: parseInt(size),
                color: color,
                hash: hash.toString(16).substring(0, 6).toUpperCase(),
                createdAt: new Date().toISOString()
            };
            
            res.json({
                success: true,
                message: 'Информация об аватаре',
                data: avatar
            });
            
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Ошибка генерации информации',
                error: error.message
            });
        }
    }
}

module.exports = new AvatarController();