class Term {
    constructor (div, user, prompt, demo) {
        this.parentDiv = div;
        this.user = user;
        this.prompt = user.concat(`~${prompt}`)
        this.isDemo = demo
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
            this.clear()
            return;
        }
        else if ( func === "echo" ) {
            if ( params ) {
                this.terminal.write('\r\n' + params);
            }
        } 

        this.terminal.prompt()
    }

    clear(noPrompt)  {
        
        this.terminal.clear()
        this.terminal.write('\b \b'.repeat(5))
    }

    traverseHistory(direction) {
        let data = ""
        let blanks = '\b \b'.repeat(this.terminal._core.buffer.x - this.prompt.length - 1)
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


    // pass through Terminal div object
    startTerm() {
        this.terminal.open(this.parentDiv);
        this.fit()
        new ResizeObserver( () => { this.fit() } ).observe(this.parentDiv)
        this.terminal.prompt = () => {
            this.terminal.write('\r\n' + this.prompt + ' ')
        };
        if (this.isDemo) {
            this.terminal.write('Welcome to the JSLearn terminal demo!\r\nTheres only a limited number of options in the demo\r\nTry some of the following:\r\n   echo clear\r\n')
        }
        this.terminal.write(this.prompt + ' ');
        this.terminal.setOption('cursorBlink', true);
        this.theme = {
            background: '#0000',
            foreground: '#000'
        }
        this.terminal.setOption('theme', this.theme);
        // this.fitAddon.fit();
        // this.fit();
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

// TODO: websocket for output and input https://cheatcode.co/tutorials/how-to-set-up-a-websocket-server-with-node-js-and-express