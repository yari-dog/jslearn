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
        } return true;
    }

    async #checkIfLoggedIn() {
        const meCall = await this.#authrequest('me','get')
        console.log(meCall)
        if (meCall.status == 401) {
            console.log('401')
            const refreshCall = await this.#authrequest('auth/refresh','post')
            console.log(refreshCall)
            if (refreshCall.status == 401) {
                console.log(refreshCall.response)
                return false;
            } else if (refreshCall.status == 200) {
                return await this.#checkIfLoggedIn();
            } else {
                console.log(refreshCall.response)
                return(false)
            }
        } else if (meCall.status == 200) {
            this.username = meCall.response;
            return true;
        } else {
            console.log(meCall.response)
            return false;
        }
        
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
}