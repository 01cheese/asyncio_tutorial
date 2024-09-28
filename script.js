function loadMarkdown(filename) {
    fetch(filename)
        .then(response => response.text())
        .then(text => {
            const markdownContent = marked.parse(text);  // Используем marked.parse()
            document.getElementById('markdown-content').innerHTML = markdownContent;
        })
        .catch(error => console.error('Ошибка загрузки файла:', error));
}
