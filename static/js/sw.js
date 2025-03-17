const CACHE_NAME = 'spiriwile-cache-v1';
const STATIC_ASSETS = [
    '/',
    '/static/css/style.css',
    '/static/js/theme.js',
    '/static/js/copy.js',
    '/static/js/server-status.js',
    '/static/js/ui.js',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js'
];

// Встановлення Service Worker та кешування статичних файлів
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(STATIC_ASSETS))
    );
});

// Активація та видалення старих кешів
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        })
    );
});

// Стратегія кешування: Network First для API, Cache First для статичних файлів
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);
    
    // Для API запитів використовуємо Network First
    if (url.href.includes('api.mcsrvstat.us')) {
        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    // Кешуємо успішну відповідь
                    const clonedResponse = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, clonedResponse);
                    });
                    return response;
                })
                .catch(() => {
                    // Якщо немає мережі, повертаємо з кешу
                    return caches.match(event.request);
                })
        );
    } 
    // Для статичних файлів використовуємо Cache First
    else {
        event.respondWith(
            caches.match(event.request)
                .then((response) => {
                    if (response) {
                        return response;
                    }
                    return fetch(event.request).then((response) => {
                        // Кешуємо нові статичні файли
                        if (response.status === 200) {
                            const clonedResponse = response.clone();
                            caches.open(CACHE_NAME).then((cache) => {
                                cache.put(event.request, clonedResponse);
                            });
                        }
                        return response;
                    });
                })
        );
    }
}); 