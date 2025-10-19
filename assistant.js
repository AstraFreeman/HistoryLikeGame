// assistant.js - Модуль керування асистентом

let assistantElement = null;
let moveSpeed = 20;
let isMovingByKeyboard = false;

// Функція ініціалізації асистента
function initAssistant(octopusElement) {
    if (!octopusElement) {
        console.error('Асистент не знайдений!');
        return false;
    }
    
    assistantElement = octopusElement;
    console.log('Асистент ініціалізовано успішно');
    
    // Додаємо керування клавіатурою
    setupKeyboardControls();
    
    return true;
}

// Налаштування керування клавіатурою
function setupKeyboardControls() {
    document.addEventListener("keydown", (event) => {
        // Ігноруємо, якщо асистент прихований
        if (assistantElement.classList.contains('hidden')) {
            return;
        }

        const rect = assistantElement.getBoundingClientRect();
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        // Поточні координати (з fixed позиціонування)
        const currentRight = parseInt(window.getComputedStyle(assistantElement).right) || 20;
        const currentBottom = parseInt(window.getComputedStyle(assistantElement).bottom) || 20;
        
        let moved = false;

        switch (event.key) {
            case "ArrowUp":
                if (rect.top > 0) {
                    assistantElement.style.bottom = (currentBottom + moveSpeed) + "px";
                    moved = true;
                }
                break;
            case "ArrowDown":
                if (rect.bottom < windowHeight) {
                    assistantElement.style.bottom = (currentBottom - moveSpeed) + "px";
                    moved = true;
                }
                break;
            case "ArrowLeft":
                if (rect.left > 0) {
                    assistantElement.style.right = (currentRight + moveSpeed) + "px";
                    assistantElement.style.transform = "scaleX(1)";
                    moved = true;
                }
                break;
            case "ArrowRight":
                if (rect.right < windowWidth) {
                    assistantElement.style.right = (currentRight - moveSpeed) + "px";
                    assistantElement.style.transform = "scaleX(-1)";
                    moved = true;
                }
                break;
        }

        // Змінюємо GIF при русі
        if (moved) {
            isMovingByKeyboard = true;
            assistantElement.src = "image/Sprut_Move.gif";
            
            // Повертаємо Idle після зупинки
            setTimeout(() => {
                if (isMovingByKeyboard) {
                    assistantElement.src = "image/Sprut_Idle.gif";
                    isMovingByKeyboard = false;
                }
            }, 500);
        }
    });
}

// Функція обробки кліку по асистенту
function onAssistantClick() {
    const messages = [
        '👋 Привіт! Використовуй стрілки на клавіатурі, щоб переміщати мене!',
        '🎮 Натискай кнопки внизу для взаємодії!',
        '📚 Обирай історичні періоди та вивчай історію України!',
        '🔍 Цікаві факти чекають на тебе!'
    ];
    
    const factBox = document.getElementById('factBox');
    if (factBox) {
        factBox.textContent = messages[Math.floor(Math.random() * messages.length)];
        factBox.classList.remove('hidden');
        setTimeout(() => {
            factBox.classList.add('hidden');
        }, 3000);
    }
}

// Функція отримання стану руху
function isAssistantMoving() {
    return isMovingByKeyboard;
}

// Експорт функцій для глобального використання
if (typeof window !== 'undefined') {
    window.initAssistant = initAssistant;
    window.onAssistantClick = onAssistantClick;
    window.isAssistantMoving = isAssistantMoving;
}
