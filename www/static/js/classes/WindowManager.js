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
        if (c === "runCode") {
            const html = this.subColumn.top.window.view.iframe.contentWindow.editor.getValue();
            console.log(html)
            this.subColumn.bottom.window.view.setContents(html);
        }
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
        container.container.remove();
        const newDivider = Object.entries(container.parent.children).length - 1
        for (const [key, value] of Object.entries(container.parent.children)) {
            value.autoResize(newDivider)
            if (value.id === container.id) {
                container.parent.children.splice(key)
            }
        }
    }

    setLayout(layout) {
        if (!layout) {
            if (this.subColumn) this.close(this.subColumn), delete this.subColumn;
            delete this.currentLayout;
            return
        }
        if (this.currentLayout != layout.name){
        this.currentLayout = layout.name
        if (layout.subColumn) {
            if (this.subColumn) this.close(this.subColumn), delete this.subColumn;
            this.subColumn = new Column(this.root);
            if (layout.subColumn.topFrame) {
                this.subColumn.top = new Row(this.subColumn)
                this.subColumn.top.window = new Window(this.subColumn.top, false, 'editorframe')
                this.subColumn.top.window.setTitle('<p style="cursor:pointer" onclick="windowManager.parseWMCommand(`runCode`)">Run this Code!</p>')
                if (layout.subColumn.topFrame.source) this.subColumn.top.window.load(layout.subColumn.topFrame.source)
            }
            if (layout.subColumn.bottomFrame) {
                this.subColumn.bottom = new Row(this.subColumn)
                this.subColumn.bottom.window = new Window(this.subColumn.bottom, false, 'resultsframe')
                if (layout.subColumn.bottomFrame.source) this.subColumn.bottom.window.load(layout.subColumn.bottomFrame.source)
            }
        }
    }
    }
};
