class Container {
    constructor(parent, id, params) {
        this.params = params;
        this.parent = parent;
        this.id = id;
    }

    

    buildContainer(attributes){
        this.div = document.createElement("div");
        this.div.setAttribute("id",this.id);
        for (const param in params) {
            if ( param === "textContent" ) {  
                item.textContent = elementParams[param]
            }
            else if ( param === "style" ) {
                for (let property of Object.keys(elementParams[param])) {
                    item.style[property.toString()] = elementParams[param][property.toString()];
                }
            }
            else if ( param === "id" ) {
                console.log("id overwritten; was: ",this.id," now: ",params[param]);
            }
            else {
                item.setAttribute(param, elementParams[param])
            }
        }
        this.parent.appendChild(this.div);
        this.object = document.getElementById(this.id);
    }
}

class WindowManager {
    constructor() {
        this.containers = [];
        this.columns = [[],[]];
        this.rows = [[],[],[]];
    }

    container(container){
        return;
    }

    newContainer(parent, id){
        if ( typeof id === "undefined" ) {
            id =  `div${this.containers.length}`;
        }
        this.containers.push(new Container(parent, id));
        this.containers[this.containers.length -1].buildContainer();
        return this.containers[this.containers.length -1];
    }

    appendContainer(container, element, elementParams){
        let item = document.createElement(element);
        for (const param in elementParams) {
            console.log(param, elementParams[param])
            if ( param === "textContent" ) {
                
                item.textContent = elementParams[param]
            }
            else if ( param === "style" ) {
                for (let property of Object.keys(elementParams[param])) {
                    item.style[property.toString()] = elementParams[param][property.toString()];
                }
            }
            else {
                item.setAttribute(param, elementParams[param])
            }
        }
        container.appendChild(item)
    }

}



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
    if (direction == "top") {
        bottomRow.style.height = `${bottomRowHeight - adjust}%`;
        topRow.style.height = `${topRowHeight + adjust}%`;
    }
    else {
        topRow.style.height = `${topRowHeight - adjust}%`;
        bottomRow.style.height = `${bottomRowHeight + adjust}%`;
    }
}