function loadMarkdown(filename) {
    fetch(filename)
        .then(response => response.text())
        .then(text => {
            const markdownContent = marked(text); // Конвертируем Markdown в HTML с помощью marked.js
            document.getElementById('markdown-content').innerHTML = markdownContent;
        })
        .catch(error => console.error('Ошибка загрузки файла:', error));
}

// Загрузка первой части книги при загрузке страницы
window.onload = function() {
    loadMarkdown('PART_1.md');
};
