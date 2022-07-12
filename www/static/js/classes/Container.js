class Container {
    /**
     * 
     * @param {number} parentID the ID of the parent container.
     * @param {object} attributes the attributes of the container
     * 
     */
    constructor(parent, attributes, id) {
        this.id = id ? id : `container-${document.querySelectorAll('.cont').length}`;
        if (parent === document.body) {
            this.parent = {container: parent}
        } else {
            this.parent = parent;
            this.parent.children.push(this);
        }
        this.children = [];
        this.#buildContainer(attributes);

    }

    /**
     * 
     * @param {string} height css format
     * @param {string} width css format
     */
    resize(height,width) {
        if (height) { this.container.style.height = height };
        if (width) { this.container.style.width = width };
    }

    /**
     * 
     * @param {object} attributes the attributes to set, in object, following 
     */
    setAttributes(attributes) {
        for (const param in attributes) {
            if ( param === "textContent" ) {  
                this.container.textContent = attributes[param]
            }
            else if ( param === "style" ) {
                for (const property in attributes[param]) {
                    this.container.style[property.toString()] = attributes[param][property.toString()];
                }
            }
            else if ( param === "classes") {
                for (const property in attributes[param]) {
                    this.container.classList.add(attributes[param][property]);
                }
            }
            else if ( param === "innerHTML" ){
                this.container.innerHTML = attributes[param]
            }
            else {
                this.container.setAttribute(param, attributes[param])
            }
        }
    }

    #buildContainer(attributes) {
        // if type is set in attributes, use that, if not use div
        this.container = document.createElement(attributes.type ? attributes.type : 'div');
        this.container.id = this.id;
        this.container.classList.add('cont')
        if (this.parentID === 'body') {
            document.body.appendChild(this.container)
        } else {
            this.parent.container.appendChild(this.container)
        }

        this.setAttributes(attributes);
    }
};