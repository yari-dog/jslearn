



async function startup() {
    windowManager = new WindowManager();
    user = await new User();
    if (await user.load(true)) {
        //windowManager.subColumn.children[0].children[0].view.load('/views/terminal?user=demo')
        windowManager.subColumn.children[0].children[0].view.load(`/`)
        windowManager.subColumn.children[1].children[0].view.load(`/views/terminal?user=${user.username}`)
    } else {
        windowManager.mainWindow.view.load('/views/login?flow=login')
        windowManager.subColumn.children[0].children[0].view.load(`/views/login`)
    }
    
// const user = new User('test');
}
/*
const rootContainer = windowManager.createWindow();
const mainColumn = windowManager.createColumn();
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const urlPath = '/views'.concat(window.location.pathname.replace('/home',''))
const view = windowManager.createRow(mainColumn, urlPath);
*/

document.addEventListener('DOMContentLoaded', () => {
    startup();
})

