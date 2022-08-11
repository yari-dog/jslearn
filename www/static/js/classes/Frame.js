class Frame extends Container{
    constructor(parent, id) {
        super(parent, {classes: ['frame'], style: {height: '100%'}},id);
        this.iframe = document.createElement('iframe')
        this.iframe.classList.add('iframe')
        id ? this.iframe.id = id : this.iframe.id = `iframe${document.getElementsByTagName('iframe').length}`;
        this.container.appendChild(this.iframe)
    }

    #deleteFrame() {
        this.iframe.remove();
    }

    #loadFrame(url) {
        this.iframe = document.createElement('iframe')
        this.iframe.classList.add('iframe');
        this.container.appendChild(this.iframe);
        this.iframe.contentWindow.location.href = url;
    }

    load(url) {
        if (this.iframe) this.#deleteFrame();
        console.log('test')
        this.#loadFrame(url);
    }

    setContents(html) {
        this.iframe.contentWindow.document.open();
        this.iframe.contentWindow.document.write(html);
        this.iframe.contentWindow.document.close();
    }
}