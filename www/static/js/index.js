

const windowManager = new WindowManager();
const rootContainer = windowManager.createWindow();
const mainColumn = windowManager.createColumn();
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const urlPath = '/views'.concat(window.location.pathname.replace('/home',''))
const view = windowManager.createRow(mainColumn, urlPath);