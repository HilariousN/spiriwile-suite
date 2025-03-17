// Функція для копіювання IP-адреси
function copyIP() {
    const ipElement = document.getElementById('server-ip');
    const ip = ipElement.textContent;
    
    navigator.clipboard.writeText(ip).then(() => {
        const tooltip = bootstrap.Tooltip.getInstance(ipElement);
        
        // Змінюємо текст підказки
        ipElement.setAttribute('data-bs-original-title', 'Скопійовано!');
        tooltip.show();
        
        // Повертаємо оригінальний текст через 2 секунди
        setTimeout(() => {
            ipElement.setAttribute('data-bs-original-title', 'Натисніть щоб скопіювати');
            tooltip.hide();
        }, 2000);
    }).catch(err => {
        console.error('Помилка при копіюванні:', err);
    });
}

// Ініціалізація тултіпів при завантаженні сторінки
document.addEventListener('DOMContentLoaded', () => {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}); 