const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
var terminal
document.addEventListener('DOMContentLoaded', () => {
    terminal = new Term(document.getElementById('terminal'), urlParams.get('user'), "$", (urlParams.get('user') === 'demo'))
    terminal.startTerm()
})
