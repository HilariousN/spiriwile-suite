// Константи для роботи з кешем
const CACHE_KEY = 'server-status';
const CACHE_DURATION = 60000; // 1 хвилина в мілісекундах

// Функція для отримання кешованих даних
function getCachedData() {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
            return data;
        }
    }
    return null;
}

// Функція для збереження даних в кеш
function setCachedData(data) {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
        data,
        timestamp: Date.now()
    }));
}

// Функція для оновлення інтерфейсу
function updateUI(data) {
    // Оновлюємо кількість гравців
    const playersElement = document.getElementById('total-players');
    if (playersElement) {
        const onlinePlayers = data.online ? data.players.online : 0;
        const maxPlayers = data.online ? data.players.max : 0;
        playersElement.textContent = `${onlinePlayers}/${maxPlayers}`;
    }
    
    // Оновлюємо версію сервера
    const versionElement = document.getElementById('version-info');
    if (versionElement) {
        versionElement.textContent = data.online ? data.version : 'Офлайн';
    }

    // Оновлюємо версію в футері
    const footerVersionElement = document.getElementById('server-version');
    if (footerVersionElement) {
        footerVersionElement.textContent = `Версія: ${data.online ? data.version : 'Офлайн'}`;
    }
    
    // Оновлюємо статус
    const statusDot = document.querySelector('.status-dot');
    const statusText = document.querySelector('.server-status');
    
    if (statusDot && statusText) {
        if (data.online) {
            statusDot.className = 'status-dot online';
            statusText.textContent = 'Сервер працює';
        } else {
            statusDot.className = 'status-dot offline';
            statusText.textContent = 'Сервер офлайн';
        }
    }
}

// Функція для оновлення статусу сервера
async function updateServerStatus() {
    const serverAddress = 'spiriwile.duckdns.org';
    
    try {
        // Спочатку перевіряємо кеш
        const cachedData = getCachedData();
        if (cachedData) {
            updateUI(cachedData);
            return;
        }

        // Якщо кешованих даних немає або вони застаріли, робимо запит
        const javaResponse = await fetch(`https://api.mcsrvstat.us/3/${serverAddress}`, {
            headers: {
                'User-Agent': 'SpiriWile/1.0'
            }
        });
        const javaData = await javaResponse.json();
        
        // Зберігаємо дані в кеш
        setCachedData(javaData);
        
        // Оновлюємо інтерфейс
        updateUI(javaData);
    } catch (error) {
        console.error('Помилка при оновленні статусу сервера:', error);
        
        // Встановлюємо статус помилки
        const statusDot = document.querySelector('.status-dot');
        const statusText = document.querySelector('.server-status');
        const versionElement = document.getElementById('version-info');
        const playersElement = document.getElementById('total-players');
        
        if (statusDot) statusDot.className = 'status-dot error';
        if (statusText) statusText.textContent = 'Помилка перевірки';
        if (versionElement) versionElement.textContent = 'Помилка перевірки';
        if (playersElement) playersElement.textContent = '-/-';
    }
}

// Оновлюємо статус при завантаженні та кожну хвилину
document.addEventListener('DOMContentLoaded', () => {
    updateServerStatus();
    setInterval(updateServerStatus, CACHE_DURATION);
}); 