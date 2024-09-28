// Переключение темы
function toggleTheme() {
    const body = document.body;
    body.classList.toggle('dark-theme');
    const themeToggleBtn = document.getElementById('theme-toggle');

    if (body.classList.contains('dark-theme')) {
        themeToggleBtn.textContent = '☀️ Светлая тема';
    } else {
        themeToggleBtn.textContent = '🌙 Темная тема';
    }

    // Сохранение состояния темы в localStorage
    if (body.classList.contains('dark-theme')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.removeItem('theme');
    }
}

// Загрузка сохраненной темы при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-theme');
        document.getElementById('theme-toggle').textContent = '☀️ Светлая тема';
    }
});

// Пагинация и загрузка Markdown
let currentPage = 0;
let currentFolder = 'ENGLISH';  // По умолчанию загружается английская версия
const totalPages = 17;  // Количество глав

function loadMarkdown(filename) {
    const filePath = `${currentFolder}/${filename}`;  // Формируем путь к файлу
    fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Файл не найден: ${filename}`);
            }
            return response.text();
        })
        .then(text => {
            const markdownContent = marked.parse(text);  // Конвертируем Markdown в HTML
            document.getElementById('markdown-content').innerHTML = markdownContent;
            window.scrollTo(0, 0);
        })
        .catch(error => console.error('Ошибка загрузки файла:', error));
}

function loadPage(page) {
    loadMarkdown(`PART_${page}.md`);
    document.getElementById('page-info').textContent = `${page}`;
    currentPage = page;

    // Обновляем состояние кнопок
    document.querySelector('.pagination button:first-child').disabled = currentPage === 0;
    document.querySelector('.pagination button:last-child').disabled = currentPage === totalPages;
}

function nextPage() {
    if (currentPage < totalPages) {
        loadPage(currentPage + 1);
    }
}

function prevPage() {
    if (currentPage > 1) {
        loadPage(currentPage - 1);
    }
}
// Смена папки на основе выбранного языка
function changeLanguage() {
    const select = document.getElementById('language');
    currentFolder = select.value;
    loadPage(0);  // Загружаем первую главу из новой папки
}

// Загружаем первую главу при загрузке страницы
window.onload = function() {
    loadPage(0);
};
