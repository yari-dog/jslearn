
class View extends Container{
    /**
     * 
     * @param {object} parent Object for view
     * 
     */
    constructor(parent) {
        super(parent, {class: 'view'});
        window.addEventListener('click',  e => {
            if (e.target.matches('[data-link]')) {
                e.preventDefault();
                this.load(e.target.href,true);
            }
        })
        window.addEventListener('popstate', () => {
            this.load(location.pathname,false)
        })
    };

    /**
     * 
     * @param {string} url URL for view to load, format /view/*
     * 
     */
    load(url, shouldReplaceState) {
        console.log(url)
        if (url === '/home') url = '/views'
        else url = url.replace('/home','/views')
        console.log(url)
        if (shouldReplaceState) {
            history.pushState(null, null, url.replace('/views','/home')); console.log('pushing state');
        }
        this.parent.setTitle(url);
        this.#loadView(url);
    }

    #executeScriptElements(containerElement) {
        const scriptElements = containerElement.querySelectorAll("script");
      
        Array.from(scriptElements).forEach((scriptElement) => {
          const clonedElement = document.createElement("script");
      
          Array.from(scriptElement.attributes).forEach((attribute) => {
            clonedElement.setAttribute(attribute.name, attribute.value);
          });
          
          clonedElement.text = scriptElement.text;
      
          scriptElement.parentNode.replaceChild(clonedElement, scriptElement);
        });
    };

    /**
     * 
     * @param {string} url 
     */
    async #loadView(url){
        let data = await this.#fetchAsync(url);
        this.container.innerHTML = data;
        this.#executeScriptElements(this.container)
    }

    async #fetchAsync(url){
        let response = await fetch(url);
        if (response.status == 404){
            response = await this.#fetchAsync('/views/404');
            return response
        }
        let data = await response.text();
        return(data)
    }

}