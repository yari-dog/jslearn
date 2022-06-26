function ratioColumn(direction, adjust) {
    const windowWidth = document.getElementById("root").offsetWidth;
    const columns = document.getElementsByClassName("column");
    const mainColumn = columns["main"];
    const subColumn = columns["sub"];
    const mainColumnWidth = Math.round(mainColumn.offsetWidth/windowWidth*100);
    const subColumnWidth = Math.round(subColumn.offsetWidth/windowWidth*100);
    console.log(mainColumnWidth)
    if (direction === "main") {
        subColumn.style.width = `${subColumnWidth - adjust}%`;
        mainColumn.style.width = `${mainColumnWidth + adjust}%`;       
    }
    else {
        mainColumn.style.width = `${mainColumnWidth - adjust}%`;
        subColumn.style.width = `${subColumnWidth + adjust}%`;       
    }
}

function ratioRow(direction, adjust) {
    const windowHeight = document.getElementById("root").offsetHeight;
    const rows = document.getElementsByClassName("row");
    const topRow = rows["top"];
    const bottomRow = rows["bottom"];
    const topRowHeight = Math.round(topRow.offsetHeight/windowHeight*100);
    const bottomRowHeight = Math.round(bottomRow.offsetHeight/windowHeight*100);
    if (direction === "top") {
        bottomRow.style.height = `${bottomRowHeight - adjust}%`;
        topRow.style.height = `${topRowHeight + adjust}%`;
    }
    else {
        topRow.style.height = `${topRowHeight - adjust}%`;
        bottomRow.style.height = `${bottomRowHeight + adjust}%`;
    }
}