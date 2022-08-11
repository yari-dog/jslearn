class Column extends Container {
    constructor(parent) {
        super(parent, { classes: ['column'], style: { width: `${100 /(parent.container.querySelectorAll('.column').length + 1 )}%`}});
        for ( let i = 0; i < parent.children.length; i++ ) {
            if (parent.children[i].container.classList.contains('column')) {
                parent.children[i].resize(null,`${100 /(parent.container.querySelectorAll('.column').length)}%`)
            }
        }
    }

    autoResize(n) {
        console.log(100/n)
        this.resize(null,`${100/n}%`)
    }
}