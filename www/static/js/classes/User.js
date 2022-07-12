

class User {
    constructor(uid) {
        this.uid = uid;
        this.settings = this.getSettings();
        this.isLoggedIn = this.#checkIfLoggedIn()
    }

    getSettings() {
        this.stylesheet = document.createElement('link');
        this.stylesheet.setAttribute('rel', 'stylesheet');
        this.stylesheet.setAttribute('type', 'text/css');
        this.stylesheet.setAttribute('href',`/api/user/${this.uid}/settings/stylesheet.css`);
        document.getElementsByTagName('head')[0].appendChild(this.stylesheet)

    }

    async #checkIfLoggedIn() {
        const meCall = await this.#authrequest('me')
        if (meCall.status = 401) {
            const refreshCall = await this.#authrequest('auth/refresh')
            if (refreshCall.status = 401) {
                return false;
            } else if (refreshCall.status = 200) {
                return true;
            } else {
                console.log(refreshCall.status)
                return(false)
            }
        } else if (meCall.status = 200) {
            return true;
        } else {
            console.log(meCall.status)
            return false;
        }
        
    }

    async #authrequest(path) {
        return new Promise (function (resolve, reject) {
            let xhr = new XMLHttpRequest();
            xhr.open("POST", `/api/${path}`, true);
            xhr.onload = function () { 
                resolve({status: xhr.status, response: xhr.response});
            };
            xhr.send();
        });
    }
}