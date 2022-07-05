

console.log("index.js loaded");
const modifier = 83;




let smallerButtonCol = document.getElementById('smallerCol');
smallerButtonCol.addEventListener('click', function(event) {
    const element = document.getElementById('learn')
    element.style.color = "red";
    ratioColumn("main",-10)
}, true)

let biggerButtonCol = document.getElementById('largerCol');
biggerButtonCol.addEventListener('click', function(event) {
    const element = document.getElementById('learn')
    element.style.color = "red";
    ratioColumn("main",+10)
}, true)

let smallerButtonRow = document.getElementById('smallerRow');
smallerButtonRow.addEventListener('click', function(event) {
    const element = document.getElementById('learn')
    element.style.color = "red";
    ratioRow("top",-10)
}, true)

let biggerButtonRow = document.getElementById('largerRow');
biggerButtonRow.addEventListener('click', function(event) {
    const element = document.getElementById('learn')
    element.style.color = "red";
    ratioRow("top",+10)
}, true)



const terminals = [];
terminals.push(new Term());
terminals[0].startTerm('console','yari','$');
// startTerm(modifier)