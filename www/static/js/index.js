

console.log("index.js loaded");

function ratioColumn(direction, adjust) {
    const windowWidth = document.getElementById("root").offsetWidth;
    const columns = document.getElementsByClassName("column");
    const mainColumn = columns["main"];
    const mainColumnWidth = mainColumn.offsetWidth/windowWidth*100;
    if (direction === "main") {
        columns["sub"].style.width = `${mainColumnWidth - adjust}%`;
        mainColumn.style.width = `${mainColumnWidth + adjust}%`;       
    }
    else {
        mainColumn.style.width = `${mainColumnWidth - adjust}%`;
        columns["sub"].style.width = `${mainColumnWidth + adjust}%`;       
    }
}

function ratioRow(direction, adjust) {
    const windowHeight = document.getElementById("root").offsetHeight;
    const rows = document.getElementsByClassName("row");
    const topRow = rows["top"];
    const topRowHeight = topRow.offsetHeight/windowHeight*100;
    if (direction === "top") {
        rows["bottom"].style.height = `${topRowHeight - adjust}%`;
        topRow.style.height = `${topRowHeight + adjust}%`;
    }
    else {
        topRow.style.height = `${topRowHeight - adjust}%`;
        rows["bottom"].style.height = `${topRowHeight + adjust}%`;
    }
}

function loadTerminal() {
    const term = new Terminal();
    const fitAddon = new FitAddon.FitAddon();
    term.loadAddon(fitAddon);

    term.open(document.getElementById('console'));
    fitAddon.fit();
    term.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ');
}

loadTerminal()