class Container {
    constructor(parent, attributes) {
        this.attributes = attributes;
        this.parent = parent;
        this.id = this.attributes.id;
    }

    

    buildContainer(){
        let div = document.createElement("div");
        div.setAttribute("id",this.id);
        for (const param in this.attributes) {
            if ( param === "textContent" ) {  
                item.textContent = this.attributes[param]
            }
            else if ( param === "style" ) {
                for (let property of Object.keys(this.attributes[param])) {
                    div.style[property.toString()] = this.attributes[param][property.toString()];
                }
            }
            else if ( param === "id" ) {
                console.log("id overwritten; was: ",this.id," now: ",this.attributes[param]);
            }
            else {
                div.setAttribute(param, this.attributes[param])
            }
        }
        this.parent.appendChild(div);
        this.object = document.getElementById(this.id);
    }
}

class WindowManager {
    constructor() {
        this.window = {};
        this.containers = [];
        this.columns = [];
    }

    createWindow(){
        const rootAttributes = {
            style: {
                'background-image': "url('/static/img/background.webp')",
                'background-position': "center center",
                'background-size': "cover"
            },
            class: 'root',
            id: 'root'
        }
        const container = this.newContainer(document.body, rootAttributes)
        this.window = {
            id: 'root',
            class: 'root',
            container: container
        }
        return this.window.container;
    }

    createColumn(){
        if (this.columns.length === 0) {
            var main = true; 
            var classIs = 'main';
        }
        else {
            var main = false;
            var classIs = 'sub';
        };
        let column = {
            rows: [],
            isMain: main,
            attributes: {
                class: `${classIs} column`,
                id: `column${this.columns.length}`,
                style: {
                    height: '100%',
                    width: `${100/(this.columns.length + 1)}%`
                }
            }
        }
        for(let i = 0; i < this.columns.length; i++ ){
            this.columns[i].container.object.style.width = `${100/(this.columns.length + 1)}%`;
        }
        column.container = this.newContainer(document.getElementById('root'), column.attributes)
        this.columns.push(column);
        return column;
    }

    createRow(column){
        let row = {
            attributes: {
                class: 'row',
                id: `${column.attributes.id}row${column.rows.length}`,
                style: {
                    height: `${100/(column.rows.length +1)}%`,
                    width: `100%`,
                }
            },
            viewAttributes: {
                class: 'view',
                id: `${column.attributes.id}row${column.rows.length}view`
            }
        }
        for(let i = 0; i < column.rows.length; i++ ){
            column.rows[i].container.object.style.width = `${100/(column.rows.length + 1)}%`;
        }
        row.container = this.newContainer(document.getElementById(column.attributes.id), row.attributes)
        row.view = this.newContainer(document.getElementById(row.container.id), row.viewAttributes)
        column.rows.push(row);
        return row;
    }

    loadView(row,view){
        
    }

    newContainer(parent, attributes){
        if ( typeof attributes.id === "undefined" ) {
            attributes.id =  `div${this.containers.length}`;
        }
        if ( typeof parent === "undefined" ){
            console.log('parent undefined:',parent);
            return
        }
        this.containers.push(new Container(parent, attributes));
        this.containers[this.containers.length -1].buildContainer();
        return this.containers[this.containers.length -1];
    }

    appendContainer(container, element, elementParams){
        let item = document.createElement(element);
        for (const param in elementParams) {
            console.log(param, elementParams[param])
            // if ( param === "textContent" ) {
                
            //     item.textContent = elementParams[param]
            // }
            // else if ( param === "style" ) {
            //     for (let property of Object.keys(elementParams[param])) {
            //         item.style[property.toString()] = elementParams[param][property.toString()];
            //     }
            // }
            // else {
            //     item.setAttribute(param, elementParams[param])
            // }
            item.setAttribute(param, elementParams[param])
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