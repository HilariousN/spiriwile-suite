// Функція для показу контенту після завантаження
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    setTimeout(() => {
        document.querySelector('.loader-wrapper').classList.add('loader-hidden');
    }, 500);
});

// Функції для анімацій при прокручуванні
document.addEventListener('DOMContentLoaded', () => {
    const debugHolidayBtn = document.getElementById('debug-holiday');
    
    // Показуємо дебаг кнопку тільки якщо є параметр pascha=true
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('pascha') === 'true') {
        debugHolidayBtn?.classList.remove('d-none');
    }
    
    function addVisibleClass(element) {
        if (element && !element.classList.contains('visible')) {
            element.classList.add('visible');
        }
    }

    // Активація початкових анімацій
    setTimeout(() => {
        addVisibleClass(document.querySelector('.navbar'));
        addVisibleClass(document.querySelector('.hero-section'));
    }, 100);

    // Налаштування спостерігача для анімацій при прокручуванні
    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Для секцій з картками активуємо всі картки всередині
                if (entry.target.classList.contains('features') || entry.target.classList.contains('why-us')) {
                    entry.target.querySelectorAll('.card, .col-md-3').forEach((element, index) => {
                        setTimeout(() => {
                            element.classList.add('visible');
                        }, index * 100);
                    });
                }
            }
        });
    };

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Спостерігаємо за секціями
    document.querySelectorAll('.features, .why-us, .section-title').forEach(section => {
        observer.observe(section);
    });
});

// Функція для перевірки святкових дат
function checkHoliday() {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;
    const debugMode = sessionStorage.getItem('holiday-debug');

    // Перевірка дебаг режиму
    if (debugMode === 'easter') {
        document.documentElement.setAttribute('data-theme', 'holiday-easter');
        addEasterDecorations();
        return;
    }

    // Великдень 2024 (5 травня)
    if (month === 5 && day >= 4 && day <= 6) {
        document.documentElement.setAttribute('data-theme', 'holiday-easter');
        addEasterDecorations();
        return;
    }

    // Повернення до звичайної теми
    const savedTheme = window.themeManager.getCookie('theme') || window.themeManager.getSystemTheme();
    window.themeManager.setTheme(savedTheme);
}

// Функція для додавання великодніх декорацій
function addEasterDecorations() {
    const container = document.querySelector('.hero-section');
    if (!container) return;

    const easterEmojis = ['🥚', '🐰', '🐣', '🌷', '🐥'];
    const positions = [
        { top: '10%', left: '5%' },
        { top: '20%', right: '10%' },
        { top: '15%', left: '15%' },
        { top: '25%', right: '20%' },
        { top: '30%', left: '25%' }
    ];

    positions.forEach((pos, index) => {
        const decoration = document.createElement('div');
        decoration.className = 'easter-egg';
        decoration.textContent = easterEmojis[index];
        Object.assign(decoration.style, pos);
        container.appendChild(decoration);
    });
}

// Додаємо обробник для дебаг кнопки
document.addEventListener('DOMContentLoaded', () => {
    const debugHolidayBtn = document.getElementById('debug-holiday');
    if (!debugHolidayBtn) return;

    let isHolidayMode = false;

    debugHolidayBtn.addEventListener('click', () => {
        isHolidayMode = !isHolidayMode;
        
        if (isHolidayMode) {
            sessionStorage.setItem('holiday-debug', 'easter');
            debugHolidayBtn.classList.add('active');
            checkHoliday();
        } else {
            sessionStorage.removeItem('holiday-debug');
            debugHolidayBtn.classList.remove('active');
            // Видаляємо всі великодні декорації
            document.querySelectorAll('.easter-egg').forEach(egg => egg.remove());
            // Повертаємо звичайну тему
            const savedTheme = window.themeManager.getCookie('theme') || window.themeManager.getSystemTheme();
            window.themeManager.setTheme(savedTheme);
        }
    });

    // Перевіряємо свята при завантаженні
    checkHoliday();
}); 