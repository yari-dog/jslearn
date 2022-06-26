const windowManager = new WindowManager();
const rootContainer = windowManager.newContainer(document.body,"root");
const testContainer = windowManager.newContainer(rootContainer.object)
windowManager.appendContainer(rootContainer.object,"h1", {
    textContent: "test",
    style: {
        background: "blue",
        padding: "20px"
    },
    id: "testelement"
});
