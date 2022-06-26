// const { FitAddon } = require("xterm-addon-fit");

class Term {
    constructor () {
        this.keyDown = false;
        this.history = [];
        this.currentHistory = -1;
        this.currentLine = [];
        this.terminal = new Terminal();
        this.terminal.setOption('allowTransparency', true);
        this.fitAddon = new FitAddon.FitAddon();
        this.terminal.loadAddon(this.fitAddon);
    }

    fit() {
        this.fitAddon.fit();
    }

    processCommand(command){
        let func = command.substring(0, command.indexOf(' '));
        let params = command.substring(command.indexOf(' ') + 1);
        if ( ! func ) {
            console.log('2')
            func = params;
            params = '';
        }

        if ( func === "clear" ) {
            this.terminal.write('\b \b'.repeat(5))
            this.terminal.clear()
            return;
        }
        else if ( func === "echo" ) {
            if ( params ) {
                this.terminal.write('\r\n' + params);
            }
        } 

        this.terminal.prompt()
    }

    traverseHistory(direction) {
        let data = ""
        let blanks = '\b \b'.repeat(this.terminal._core.buffer.x - 6)
        if ( direction === "up" ) {
            if ( this.currentHistory >= -1 && this.currentHistory < ( this.history.length - 1 ) )
            this.currentHistory++;
            data = data.concat(this.history[this.currentHistory]);
    
        }
        if ( direction === "down" ) {
            if ( this.currentHistory > 0 ) {
                this.currentHistory--;
                data = data.concat(this.history[this.currentHistory]);
            }
            else if ( this.currentHistory == 0 ) {
                this.currentHistory--;
            }
        }
        this.terminal.write(blanks)
        this.terminal.write(data)
        this.currentLine = []
        for (let i=0; i < data.length; i++) {this.currentLine.push(data.charAt(i))}
    }

    startTerm(div, user, prompt) {
        this.parentDiv = document.getElementById(div);
        this.terminal.open(this.parentDiv);
        new ResizeObserver( function () { this.fit }).observe(this.parentDiv)
        this.terminal.prompt = () => {
            this.terminal.write('\r\n' + user + prompt + ' ')
        };
        this.terminal.write(user + prompt + ' ');
        this.terminal.setOption('cursorBlink', true);
        this.theme = {
            background: '#00000000',
            foreground: '#000000'
        }
        this.terminal.setOption('theme', this.theme);
        // this.fitAddon.fit();
        this.fit();
        this.terminal.onKey(key => {
            const char = key.domEvent.key;
        
            // onData for paste
    
            // if key is enter do this
            if (char === "Enter") {
                let command = "";
                this.currentLine.forEach( function(i, j, k) { command = command.concat(i) });
                // replace with *execute command function*
                // console.log(command);
                this.processCommand(command);
                if ( command != "" ) {
                    this.history.unshift(command);
                    this.currentHistory = -1;
                }   
                this.currentLine = [];
            }
            else if (char === "Backspace") {
                if (this.terminal._core.buffer.x > 6) {
                    this.terminal.write('\b \b');
                    this.currentLine.pop()
                }
                
            }
            else if (char === "ArrowUp") { this.traverseHistory("up") } 
            else if (char === "ArrowDown") { this.traverseHistory("down") } 
            else {
                this.terminal.write(char);
                this.currentLine.push(char)
            }
        })
    }
}