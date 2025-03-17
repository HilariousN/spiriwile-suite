// Функція для роботи з cookies
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// Функція для отримання системної теми
function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// Функція для встановлення теми
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (document.getElementById('theme-toggle')) {
        document.getElementById('theme-toggle').checked = theme === 'dark';
    }
    setCookie('theme', theme, 365);
}

// Ініціалізація теми
function initTheme() {
    const savedTheme = getCookie('theme');
    const systemTheme = getSystemTheme();
    const initialTheme = savedTheme || systemTheme;
    setTheme(initialTheme);

    // Слідкування за зміною системної теми
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!getCookie('theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });

    // Налаштування перемикача теми
    document.addEventListener('DOMContentLoaded', () => {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.checked = document.documentElement.getAttribute('data-theme') === 'dark';
            themeToggle.addEventListener('change', () => {
                const newTheme = themeToggle.checked ? 'dark' : 'light';
                setTheme(newTheme);
            });
        }
    });
}

// Експорт функцій
window.themeManager = {
    setTheme,
    getSystemTheme,
    getCookie,
    setCookie,
    initTheme
}; 