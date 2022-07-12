const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
document.addEventListener('DOMContentLoaded', () => {
    const terminal = new Term(document.getElementById('terminal'), urlParams.get('user'), "$", (urlParams.get('user') === 'demo'))
    terminal.startTerm()
})
