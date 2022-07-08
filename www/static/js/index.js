

const windowManager = new WindowManager();
// const rootContainer = windowManager.newContainer(document.body,"root");
const rootContainer = windowManager.createWindow();
// console.log(rootContainer)
// // const testContainer = windowManager.newContainer(rootContainer.object, { id: 'test div' })
const mainColumn = windowManager.createColumn();
// const subColumn = windowManager.createColumn();
// console.log(mainColumn);
// mainColumn.container.object.style.backgroundColor = 'blue';
// windowManager.createColumn();
// windowManager.columns[1].container.object.style.backgroundColor = 'green';
// windowManager.createColumn();
windowManager.createRow(mainColumn);
windowManager.createRow(mainColumn);
// windowManager.createRow(subColumn);
// windowManager.createRow(subColumn);
// mainColumn.rows[0].view.object.style.backgroundColor = '#FF000055';
windowManager.appendContainer(mainColumn.rows[0].view.object,"p", {
    innerHTML: "test",
    style: {
        // background: "blue",
        //padding: "20px",
        margin: '0px',
        // padding: '0px',
        background: 'blue'
    },
    id: "testelement"
});
windowManager.appendContainer(mainColumn.rows[0].view.object,"a", {
    'data-link': "",
    style: {
        color: 'black'
    },
    href: "/",
    innerHTML: "/"
})

windowManager.appendContainer(mainColumn.rows[0].view.object,"a", {
    'wm-command': "new-column",
    style: {
        color: 'black'
    },
    innerHTML: "new column"
})
