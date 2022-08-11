class User {
    constructor() {
    }

    getSettings() {
        this.stylesheet = document.createElement('link');
        this.stylesheet.setAttribute('rel', 'stylesheet');
        this.stylesheet.setAttribute('type', 'text/css');
        this.stylesheet.setAttribute('href',`/api/user/${this.uid}/settings/stylesheet.css`);
        document.getElementsByTagName('head')[0].appendChild(this.stylesheet)

    }

    async load(isInWM) {
        this.isLoggedIn = await this.#checkIfLoggedIn() 
        if (!this.isLoggedIn) {
            if (isInWM) return false;
            const redirect = new URL(window.location.href);
            window.location.href = `/views/login?flow=login&redir=${redirect.pathname}`
        } 
        await this.#getUserData()
        document.getElementById('user-button').innerHTML = this.userData.username;
        document.getElementById('profile-picture').src = this.userData.profilePicture;
        return true;
    }

    async #getUserData() {
        const result = await this.makeAuthCall('me','get')
        if (result.status != 200) return false;
        this.userData = JSON.parse(result.response)
    }

    async #checkIfLoggedIn() {
        const result = await this.makeAuthCall('me','get')
        if (result.status == 200) return true;
        else return false;
    }

    async #authrequest(path, type) {
        return new Promise (function (resolve, reject) {
            let xhr = new XMLHttpRequest();
            xhr.open(type, `/api/${path}`, true);
            xhr.onload = function () { 
                resolve({status: xhr.status, response: xhr.response});
            };
            xhr.send();
        });
    }

    async makeAuthCall(path, type) {
        let result = await this.#authrequest(path, type);
        if (result.status == 401) {
            result = await this.#authrequest('auth/refresh','post');
            if (result.status != 200) {console.log(result); return false};
            result = await this.#authrequest(path, type);
        }
        return result;
    }
}