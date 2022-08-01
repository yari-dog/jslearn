class Bar extends Container {
    constructor(parent) {
        super(parent, {classes: ['bar'], innerHTML: `<div><p class="title"></p></div>`})
    }

    setTitle(title) {
        document.getElementById(this.id).querySelector('.title').innerHTML = title;
    }
}