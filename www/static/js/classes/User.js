class User {
    constructor(uid) {
        this.uid = uid;
        this.settings = this.getSettings();
    }

    getSettings() {
        this.stylesheet = document.createElement('link');
        this.stylesheet.setAttribute('rel', 'stylesheet');
        this.stylesheet.setAttribute('type', 'text/css');
        this.stylesheet.setAttribute('href',`/api/user/${this.uid}/settings/stylesheet.css`);
        document.getElementsByTagName('head')[0].appendChild(this.stylesheet)

    }
}