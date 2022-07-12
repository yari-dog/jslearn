class Window extends Container {
    /**
     * 
     * @param {object} parent parent object
     * @param {boolean} isMain is this the main window?
     */
    constructor(parent, isMain) {
        super(parent, {class: 'window'})
        this.isMain = isMain ? true : false;
        if (this.isMain) {
            this.container.classList.add('main')
        }
        this.container.addEventListener('mouseover', () => {
            this.selectWindow();
        });
        this.container.addEventListener('mouseout', () => {
            this.deselectWindow();
        });
        this.title = '';
        this.bar = new Bar(this);
        this.view = new View(this, this.isMain);
    }

    selectWindow(){
        this.container.classList.add('selected');
        try {
            this.view.container.lastChild.focus();
        } catch {}
    }

    deselectWindow(){
        this.container.classList.remove('selected');
        try {
            this.view.container.lastChild.focus();
            this.view.container.lastChild.blur();
        } catch {}
    }


    /**
     * 
     * @param {string} title title to set to
     */
    setTitle(title) {
        this.title = title;
    }

    close() {

    }

    minimize() {

    }

    maximise() {

    }

    load(url, shouldRedirect) {
        this.view.load(url, shouldRedirect ? true : false)
    }
}