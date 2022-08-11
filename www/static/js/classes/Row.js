class Row extends Container {
    constructor(parent) {
        super(parent, { classes: ['row'], style: { height: `${100 /(parent.container.querySelectorAll('.row').length + 1 )}%`}});
        for ( let i = 0; i < parent.children.length; i++ ) {
            if (parent.children[i].container.classList.contains('row')) {
                parent.children[i].resize(`${100 /(parent.container.querySelectorAll('.row').length)}%`)
            }
        }
    }

    autoResize(n) {
        this.resize(`${100/n}%`,null)
    }
}