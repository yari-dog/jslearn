class Root extends Container {
    constructor() {
        super(document.body,{class: 'root'}, 'root');
    }
}

class WindowManager {
    constructor() {
        this.root = new Root();
        this.#startup()
    }

    parseWMCommand(c) {

    }

    ratio() {

    }

    /**
     * 
     * @param {string} url url should be cleansed already
     */
    pushState(url) {
        console.log(url)
        history.pushState(null, null, url)
    }

    #startup() {
        this.mainColumn = new Column(this.root);
        this.mainRow = new Row(this.mainColumn);
        this.mainWindow = new Window(this.mainRow, true);
        // this.subColumn = new Column(this.root);
        // new Window(new Row(this.subColumn))
        // new Window(new Row(this.subColumn))
    }

    log(log){
        console.log(log)
    }

    close(container) {
        document.getElementById(container.id).remove();
        console.log(container.parent)
        for (const [key, value] of Object.entries(container.parent.children)) {
            console.log(value.id, container.id)
            if (value.id === container.id) {
                container.parent.children.splice(key)
            }
        }
    }

    setLayout(layout) {
        if (layout.subColumn) {
            if (this.subColumn) this.close(this.subColumn), delete this.subColumn;
            this.subColumn = new Column(this.root);
            if (layout.subColumn.topFrame) {
                this.subColumn.top = new Window(new Row(this.subColumn))
                this.subColumn.top.window.load(layout.subColumn.topFrame.source)
            }
            if (layout.subColumn.bottomFrame) {
                this.subColumn.bottom = new Window(new Row(this.subColumn))
                this.subColumn.bottom.window.load(layout.subColumn.bottomFrame.source)
            }
        }
    }
};

