

const windowManager = new WindowManager();
const user = new User('test');

windowManager.subColumn.children[0].children[0].view.load('/views/terminal?user=demo')
windowManager.subColumn.children[1].children[0].view.load(`/views/terminal?user=${user.uid}`)
/*
const rootContainer = windowManager.createWindow();
const mainColumn = windowManager.createColumn();
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const urlPath = '/views'.concat(window.location.pathname.replace('/home',''))
const view = windowManager.createRow(mainColumn, urlPath);
*/