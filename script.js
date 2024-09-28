function loadMarkdown(filename) {
    fetch(filename)
        .then(response => response.text())
        .then(text => {
            const markdownContent = marked.parse(text);  // Используем marked.parse
            document.getElementById('markdown-content').innerHTML = markdownContent;
        })
        .catch(error => console.error('Ошибка загрузки файла:', error));
}

let currentPage = 1;
const totalPages = 17; // Количество глав

function loadPage(page) {
    loadMarkdown(`PART_${page}.md`);
    document.getElementById('page-info').textContent = `Глава ${page} из ${totalPages}`;
    currentPage = page;
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

// Загружаем первую главу при загрузке страницы
window.onload = function() {
    loadPage(1);
};
