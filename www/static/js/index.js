console.log("index.js loaded")
let consoles = document.querySelectorAll('.console');
// console.log(consoles)

function sizeConsoles(consoles) {
    let height = document.getElementById("root").style.height
    let width = document.getElementById("root").style.width
    console.log(`${height}, ${length}`)
    for (let i = 0; i < consoles.length; i++) {
        let id = consoles[i]["id"]
        console.log(id)
        let element = document.getElementById(id)
        if (id === "learn") {
            element.style.height = "100%"
        }
        element.style.width = "40%"
    }
}

function sizeRootDiv() {
    let height = window.innerHeight
    let width = window.innerWidth
    let element = document.getElementById("root")
    element.style.height = `${height}px`
    element.style.width = `${width}px`
}

// sizeRootDiv()
// sizeConsoles(consoles)