
class View {
    constructor() {

    };

    load(url) {
        history.pushState(null, null, url);
    }
}