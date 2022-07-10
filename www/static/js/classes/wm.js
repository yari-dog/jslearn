class Container {
    constructor(parent, attributes, isFrame) {
        this.attributes = attributes;
        this.parent = parent;
        this.id = this.attributes.id;
        this.isFrame = isFrame;
    }

    

    buildContainer(){
        if (this.isFrame) { var div = document.createElement("iframe"); }
        else { var div = document.createElement("div"); }
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
            else if ( param === "innerHTML" ){
                div.innerHTML = this.attributes[param]
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
        this.topBar = {
            innerHTML: "<p class='title'>ttt</p><button class='close-button' wm-command='delete-view'></button>",
            class: "top-bar"
        }
        document.addEventListener("DOMContentLoaded", () => {
            document.body.addEventListener("click", e => {
                if (e.target.matches("[wm-command]")) {
                    console.log(e.target.getAttribute("wm-command"));
                    if (e.target.getAttribute("wm-command") === "new-column" ) {
                        this.createColumn()
                    }
                    if (e.target.getAttribute("wm-command") === "delete-view" ) {
                        this.deleteView(e.target.parentNode.parentNode)
                    }
                }    
            })
        })
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

    deleteColumn(column,index){
        document.getElementById(column.container.id).remove()
        this.columns.splice(index,1)
        for ( let i = 0; i < this.columns.length; i++ ){
            console.log(this.columns[i].container.object.style)
            document.getElementById(this.columns[i].container.id).style.width = `${100/(this.columns.length)}%`;
        }
    }

    deleteRow(column,row,index){
        const parentNode = row.parentNode;
        row.remove();
        column.rows.splice(index,1);
        for ( let i = 0; i < column.rows.length; i++ ) {
            document.getElementById(column.rows[i].container.object.id).style.height = `${100/(this.columns[i].rows.length)}%`;
        }
    }

    deleteView(view){
        console.log(view);
        const row=view.parentNode;
        let column = {};
        let colDel = false;
        for ( let i = 0; i < this.columns.length; i++ ){
            if (this.columns[i].container.id == row.parentNode.id) {
                column = this.columns[i]
                if (this.columns[i].rows.length === 1) {
                    if (this.columns.length > 1) {
                        colDel = true;
                        this.deleteColumn(this.columns[i],i)
                    }
                }
                break;
            }
        }
        if (!colDel) {
            if (column.rows.length > 1){
                for ( let i = 0; i < column.rows.length; i++) {
                    if (column.rows[i].container.object.id == row.id) {
                        this.deleteRow(column,row,i)
                        break;
                    }
                }
                
            }
        }
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
        delete column.attributes;
        this.columns.push(column);
        return column;
    }

    createRow(column, view){
        var mainRow = false;
        if (column === this.columns[0]) {
            if (column.rows.length == 0 ) {
                mainRow = true;
            }
        }
        if (!view) { var view = '/' }
        let row = {
            isMain: mainRow,
            attributes: {
                class: 'row',
                id: `${column.container.id}row${column.rows.length}`,
                style: {
                    height: `${100/(column.rows.length +1)}%`,
                    width: `100%`,
                }
            },
            boxAttributes: {
                class: 'box',
                id: `${column.container.id}row${column.rows.length}box`,
            },
            viewAttributes: {
                src: view,
                sandbox: "allow-scripts",
                class: 'view',
                title: 'iframe',
                id: `${column.container.id}row${column.rows.length}view`
            }
        }
        for(let i = 0; i < column.rows.length; i++ ){
            column.rows[i].container.object.style.height = `${100/(column.rows.length + 1)}%`;
        }
        row.container = this.newContainer(document.getElementById(column.container.id), row.attributes)
        row.box = this.newContainer(document.getElementById(row.container.id), row.boxAttributes)
        row.box.object.addEventListener("mouseover", e => { this.selectView(e)});
        row.box.object.addEventListener("mouseout", e => { this.deselectView(e) });
        row.topBar = this.newContainer(document.getElementById(row.box.id),this.topBar);
        if (mainRow){
            row.view = this.newContainer(document.getElementById(row.box.id),row.viewAttributes)
            if (view) {
                this.loadView(row.view.object, view);
            } else {
                this.loadView(row.view.object, "/")
            }
        } else {
            row.view = this.newContainer(document.getElementById(row.box.id),row.viewAttributes,true)
        }
        column.rows.push(row);
        return row;
    }

    selectView(e) {
        let potentialBox = e.target;
        let box = {};
        if (potentialBox.classList.contains("box")){ 
            box = potentialBox;
        } 
        else{
            for (let i = 0; i < 10; i++) {
                if (potentialBox.classList.contains("box")) {
                    box = potentialBox;
                    break;
                }
                else if (potentialBox.id === "root") {
                    console.log('reached root, cant find data link parent view. breaking')
                    break;
                }
                potentialBox = potentialBox.parentNode
            }
        }
        if (box) {
            box.style.outline = "1px solid pink"
        }
    };

    deselectView(e) {
        let potentialBox = e.target;
        let box = {};
        if (potentialBox.classList.contains("box")){ 
            box = potentialBox;
        } 
        else{
            for (let i = 0; i < 10; i++) {
                if (potentialBox.classList.contains("box")) {
                    box = potentialBox;
                    break;
                }
                else if (potentialBox.id === "root") {
                    console.log('reached root, cant find data link parent view. breaking')
                    break;
                }
                potentialBox = potentialBox.parentNode
            }
        }
        if (box) {
            box.style.outline = "0px solid pink"
        }
    };

    async loadView(view,viewLink){
        console.log(viewLink)
        let data = await this.fetchAsync(viewLink);
        view.innerHTML = data;
        const column = view.parentNode.parentNode.parentNode
        if (column.classList.contains("main")){
            const historyPath = viewLink.split("/").slice(2)
            console.log('pushing state', historyPath)
            history.pushState(null,null,historyPath)
        }
        this.setTitle(view,viewLink)
        this.executeScriptElements(view)
    }

    async fetchAsync(url){
        let response = await fetch(url);
        if (response.status == 404){
            response = await this.fetchAsync('/views/404');
            return response
        }
        let data = await response.text();
        return(data)
    }

    executeScriptElements(containerElement) {
        const scriptElements = containerElement.querySelectorAll("script");
      
        Array.from(scriptElements).forEach((scriptElement) => {
          const clonedElement = document.createElement("script");
      
          Array.from(scriptElement.attributes).forEach((attribute) => {
            clonedElement.setAttribute(attribute.name, attribute.value);
          });
          
          clonedElement.text = scriptElement.text;
      
          scriptElement.parentNode.replaceChild(clonedElement, scriptElement);
        });
    };

    newContainer(parent, attributes, isFrame){
        if ( typeof attributes.id === "undefined" ) {
            attributes.id =  `div${this.containers.length}`;
        }
        if ( typeof parent === "undefined" ){
            console.log('parent undefined:',parent);
            return
        }
        this.containers.push(new Container(parent, attributes, isFrame));
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
            else if ( param === "innerHTML" ){
                item.innerHTML = elementParams[param]
            }
            else {
                item.setAttribute(param, elementParams[param])
            }
        }
        container.appendChild(item)
    }

    setTitle(box,title){
        const titleBar = document.getElementById(box.parentNode.id).querySelector(".title");
        titleBar.innerHTML = title
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


