const calculator = {
    "firstNumber": null,
    "operation": null, 
    "secondNumber": null,
    "result": null,
    "addingToExistingNumber": false, //affects how number buttons behave (append to or replace display),
    "showingFinalResult": false, //continue calculation or start fresh 
    "operations": {
        add: (a,b) => {
            return a + b }, 
        subtract: (a,b) => { return a - b },
        multiply: (a,b) => { return a * b },
        divide: (a,b) => {return a/b },
    },
    calculate(a, op, b) {
        this.operation = op;
        const operationFunc = this.operations[op];
        console.log(`Op: ${this.operation}, 2nd: ${this.secondNumber}, Type: ${typeof(this.secondNumber)}`);
        if (this.operation === "divide" && this.secondNumber === "0") {
            this.updateDisplay("You can't do dat!");
            this.result = null;
            this.firstNumber = null;
            this.secondNumber = null;
            this.operation = null;
            this.addingToExistingNumber = false; 
            this.showingFinalResult = false;
            return;
        }
        else if (operationFunc) {
            let aNumber = parseFloat(a);
            let bNumber = parseFloat(b); 

            this.result = this.firstNumber = operationFunc(aNumber,bNumber);
            this.secondNumber = null;
            this.updateDisplay(this.result);
            return;
        } else {
        throw new Error(`Unknown operation ${op}`);
        }
    },
    handleInput(buttonId, buttonType) { 
        if (buttonId === "clear") {
            this.clearDisplay("");
            return;
        }

        let currentState = this.detectState();

        if (currentState === "Awaiting first number") {

            if (buttonType === "number") {
                this.firstNumber = display.value = buttonId;
                
                this.addingToExistingNumber = true;
                this.showingFinalResult = false;
            } else if (buttonType === "operation") {
                // don't really need to handle this right now, could show the current op in the display at some point in future
            } else if (buttonType === "equals") {
                //don't really need to handle this right now
            } else if (buttonType === "dot") {
                this.firstNumber = "0.";
                this.addingToExistingNumber = true;
                this.showingFinalResult = false;
                this.updateDisplay(this.firstNumber);
            } else if (buttonType === "delete") {
                //don't reallty need to handle this right now
            }
        } else if (currentState === "Adding to first number") {
            if (buttonType ==="number") {
                this.firstNumber = (this.firstNumber === null ? buttonId : this.firstNumber += buttonId);
                display.value = this.firstNumber;
                this.addingToExistingNumber = true;

            } else if (buttonType === "operation") {
                this.operation = buttonId;
                this.addingToExistingNumber = false;
            } else if (buttonType === "equals") {
                //don't really need to handle this right now
            } else if (buttonType === "dot") {
                if(!this.firstNumber.includes(".")) {
                    this.firstNumber += ".";
                    this.updateDisplay(this.firstNumber);
                }
            } else if (buttonType === "delete") {
                this.firstNumber = this.firstNumber.slice(0, -1);
                console.log(this.firstNumber);
                this.updateDisplay(this.firstNumber);
            }

        } else if (currentState === "Awaiting second number") {
            if (buttonType ==="number") {
                this.secondNumber = display.value = buttonId;
                this.addingToExistingNumber = true;
            } else if (buttonType === "operation") {
                this.operation = buttonId;
            } else if (buttonType === "equals") {
                //don't really need to handle this right now
            } else if (buttonType === "dot") {
                this.secondNumber = "0.";
                this.addingToExistingNumber = true;
                this.updateDisplay(this.secondNumber);
            } else if (buttonType === "delete") {
                //don't reallty need to handle this right now
            }
        } else if (currentState === "Adding to second number") {
            if (buttonType ==="number") {
                this.secondNumber += buttonId;
                display.value = this.secondNumber;
            } else if (buttonType === "operation") {
                //calculate the result 
                this.calculate(this.firstNumber, this.operation, this.secondNumber);

                //set the operation for the next equation
                this.operation = buttonId;
                this.showingFinalResult = false;
                this.addingToExistingNumber = false;
            } else if (buttonType === "equals") {
                this.calculate(this.firstNumber, this.operation, this.secondNumber);
                this.operation = null;
                this.showingFinalResult = true;
                
            } else if (buttonType === "dot") {
                if(!this.secondNumber.includes(".")) {
                    this.secondNumber+= ".";
                    this.updateDisplay(this.secondNumber);
                }
            } else if (buttonType === "delete") {
                this.secondNumber = this.secondNumber.slice(0, -1);
                this.updateDisplay(this.secondNumber);
            }

        } else if (currentState === "Displaying final result") {
            if (buttonType === "number") {
                this.firstNumber = display.value = buttonId;
                this.addingToExistingNumber = true;
                this.showingFinalResult = false;
                this.result = null;
                this.secondNumber = null;
                this.operation = null;
            }

            else if (buttonType === "operation") {
                this.operation = buttonId;
                console.log(`First number: ${this.firstNumber}`);
                this.addingToExistingNumber = false;
                this.showingFinalResult = false;
                
            }

            else if (buttonType === "equals") {
                //don't need to handle right now 
            }
            else if (buttonType === "dot") {
                this.firstNumber = "0.";
                this.addingToExistingNumber = true;
                this.showingFinalResult = false;
                this.result = null; 
                this.secondNumber = null;
                this.operation = null; 
                this.updateDisplay(this.firstNumber);
            }
        }
        currentState = this.detectState();
        console.log(`AFTER: State: ${currentState} 1st: ${this.firstNumber}, 2nd: ${this.secondNumber}, Op: ${this.operation}, adding2?: ${this.addingToExistingNumber}, final?" ${this.showingFinalResult}`);
    },
    detectState() {
        if (this.showingFinalResult) {
            return "Displaying final result";
        }
        if (!this.firstNumber && !this.addingToExistingNumber && !this.operation && !this.secondNumber) {
            return "Awaiting first number";
        }
        if (this.firstNumber && this.addingToExistingNumber && !this.operation && !this.secondNumber) {
            return "Adding to first number";
        } 
        if (this.firstNumber && this.operation && !this.secondNumber) {
            return("Awaiting second number");
        } 
        if (this.firstNumber && this.operation && this.secondNumber && this.addingToExistingNumber) {
            return("Adding to second number");
        }
    },
    updateDisplay(displayOutput) {
        if(displayOutput === "") {
            display.value = "";
            return;
        }
        if(displayOutput === "You can't do dat!") {
            display.value = displayOutput;
            return;
        }
        if(displayOutput === "0.") {
            display.value = "0.";
            return;
        } 
        
        if(typeof displayOutput === "string") {
            display.value = displayOutput;
            return;
        }
        
        if(typeof displayOutput === "number") {
        this.result = displayOutput;
        let roundedNumber = parseFloat(displayOutput.toFixed(5));
        display.value = roundedNumber; //limit to 5 after decimal;
        return;
        }
    },
    clearDisplay() {
        this.firstNumber = null;
        this.operation = null;
        this.secondNumber = null;
        this.result = null;
        this.updateDisplay("");
    },
    handleKeyPress(key) {
        const keyMappings = {
            '0': {id: '0', type: 'number'},
            '1': {id: '1', type: 'number'},
            '2': {id: '2', type: 'number'},
            '3': {id: '3', type: 'number'},
            '4': {id: '4', type: 'number'},
            '5': {id: '5', type: 'number'},
            '6': {id: '6', type: 'number'},
            '7': {id: '7', type: 'number'},
            '8': {id: '8', type: 'number'},
            '9': {id: '9', type: 'number'},
            '.': {id: 'dot', type: 'dot'},
            '-': {id: 'subtract', type: 'operation'},
            '+': {id: 'add', type: 'operation'},
            '/': {id: 'divide', type: 'operation'},
            '*': {id: 'multiply', type: 'operation'},
            'Backspace': {id: 'delete', type: 'delete'},
            '=': {id: 'equals', type: 'equals'},
            'Enter': {id: 'equals', type: 'equals'},
        };
        let mapping = (key >= '0' && key <= '9') ? keyMappings[parseInt(key)] : keyMappings[key];        
        this.handleInput(mapping.id, mapping.type);
    }
}

const buttons = document.querySelectorAll('.btn');
buttons.forEach(element => {
    element.addEventListener('click', (event) => {
        calculator.handleInput(event.target.id, event.target.dataset.type);
    });
});

const display = document.querySelector('#expression');

document.addEventListener('keydown', (event) => {
    const pressedKey = event.key;
    const opKeys = ['-', '+', '*', '/', '=','.', 'Enter'];
    if((pressedKey >= '0' && pressedKey <= '9') || opKeys.includes(pressedKey)) {
        calculator.handleKeyPress(pressedKey);
    }
});