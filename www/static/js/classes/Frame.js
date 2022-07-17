class Frame extends Container{
    constructor(parent) {
        super(parent, {class: 'frame'});
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
        this.#loadFrame(url);
    }
}