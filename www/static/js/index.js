



async function startup() {
    console.log('starting up')
    windowManager = new WindowManager();
    user = new User();
    if (!await user.load(true)) {
        windowManager.mainWindow.load('/views/login')
    } else {
        windowManager.mainWindow.load(location.pathname)
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

