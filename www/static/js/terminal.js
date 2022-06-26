let keyDown = false;
let history = [];
let currentHistory = -1;
let currentLine = [];

function loadTerminal(div) {
    const term = new Terminal();
    const fitAddon = new FitAddon.FitAddon();
    term.loadAddon(fitAddon);
    term.setOption('allowTransparency', true);
    term.open(document.getElementById(div));
    
    term.setOption('cursorBlink', true);
    
    let theme = {
        background: '#00000000',
        foreground: '#000000'
    }
    term.setOption('theme', theme);
    fitAddon.fit();
    return [term, fitAddon];
}

function fitTerminal(fitAddon) {
    console.log("fit")
    console.log(fitAddon)
    fitAddon.fit()
}

function traverseHistory(direction,term) {
    let data = ""
    let blanks = '\b \b'.repeat(term._core.buffer.x - 6)
    if ( direction === "up" ) {
        if ( currentHistory >= -1 && currentHistory < ( history.length - 1 ) )
        currentHistory++;
        data = data.concat(history[currentHistory]);

    }
    if ( direction === "down" ) {
        if ( currentHistory > 0 ) {
            currentHistory--;
            data = data.concat(history[currentHistory]);
        }
        else if ( currentHistory == 0 ) {
            currentHistory--;
        }
    }
    term.write(blanks)
    term.write(data)
    currentLine = []
    for (let i=0; i < data.length; i++) {currentLine.push(data.charAt(i))}
}

function processCommand(command, term) {
    
    let func = command.substring(0, command.indexOf(' '));
    let params = command.substring(command.indexOf(' ') + 1);
    if ( ! func ) {
        console.log('2')
        func = params;
        params = '';
    }

    if ( func === "clear" ) {
        term.write('\b \b'.repeat(5))
        term.clear()
        return;
    }
    else if ( func === "echo" ) {
        if ( params ) {
            term.write('\r\n' + params);
        }
    } 

    term.prompt()
}

function startTerm(modifier){
    const user = 'phil';
    const prompt = '$';
    let [conTerm, conFit] = loadTerminal('console');
    conTerm.write(user + prompt + ' ')
    conTerm.prompt = function () {
        conTerm.write('\r\n' + user + prompt + ' ')
    }

/*
    conTerm.attachCustomKeyEventHandler((event) => {

        if ( event['which'] === modifier ) {
            if (event['type'] === "keydown") {
                if ( !keyDown ) {
                    console.log('keydown ', event['which'])
                    keyDown = true;
                    console.log(keyDown);
                }
            }
            else if (event['type'] === "keyup") {
                console.log('keyup ', event['which'])
                keyDown = false
                console.log(keyDown);
            }
        }

    },false)
*/

    conTerm.onKey(key => {
        const char = key.domEvent.key;
    
        // onData for paste

        // if key is enter do this
        if (char === "Enter") {
            let command = "";
            currentLine.forEach( function(i, j, k) { command = command.concat(i) });
            // replace with *execute command function*
            // console.log(command);
            if ( command != "" ) {
                processCommand(command, conTerm);
                history.unshift(command);
                currentHistory = -1;
            }   
            currentLine = [];
        }
        else if (char === "Backspace") {
            if (conTerm._core.buffer.x > 6) {
                conTerm.write('\b \b');
                currentLine.pop()
            }
            
        }
        else if (char === "ArrowUp") { traverseHistory("up",conTerm) } 
        else if (char === "ArrowDown") { traverseHistory("down", conTerm) } 
        else {
            conTerm.write(char);
            currentLine.push(char)
        }
    })

    window.addEventListener('resize', function(event) {
        fitTerminal(conFit)
    }, true);
}

function test() {
    alert('test')
}