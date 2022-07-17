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
        const currentLocation = location.pathname;
        if (currentLocation === '/home') {
            this.mainWindow.load('/views/home')
        }
        else {
            this.mainWindow.load(currentLocation.replace('/home','/views'), false)
        }
        // this.subColumn = new Column(this.root);
        // new Window(new Row(this.subColumn))
        // new Window(new Row(this.subColumn))
    }
};

