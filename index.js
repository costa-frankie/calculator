const calculator = {
    "firstNumber": null,
    "operation": null, 
    "secondNumber": null,
    "result": null,
    "addingToExistingNumber": false, 
    "showingFinalResult": false,

    "DIVIDE_BY_ZERO_MESSAGE": "ERROR",
    "DECIMAL_PLACES": 5,
    
    "operations": {
        add: (a,b) => a + b, 
        subtract: (a,b) => a - b,
        multiply: (a,b) => a * b,
        divide: (a,b) => a/b,
    },

    detectState() {
        if (this.showingFinalResult) return "Displaying final result";
        if (this.isEmpty()) return "Awaiting first number";
        if (this.firstNumber && this.addingToExistingNumber && !this.operation) return "Adding to first number";
        if (this.firstNumber && this.operation && !this.secondNumber) return "Awaiting second number";
        if (this.firstNumber && this.operation && this.secondNumber && this.addingToExistingNumber) return "Adding to second number";
    },

    isEmpty() {
        return !this.firstNumber && !this.addingToExistingNumber && !this.operation && !this.secondNumber;
    },

    calculate(a, op, b) {
        this.operation = op;
        const operationFunc = this.operations[op];
        if (this.operation === "divide" && this.secondNumber === "0") {
            this.handleDivisionByZero();
            return;
        }

        if (!operationFunc) { 
            throw new Error(`Unknown operation ${op}`);
        }

        const aNumber = parseFloat(a);
        const bNumber = parseFloat(b); 

        this.result = this.firstNumber = operationFunc(aNumber,bNumber);
        this.secondNumber = null;
        this.updateDisplay(this.result);
    },

    handleDivisionByZero() {
        this.updateDisplay(this.DIVIDE_BY_ZERO_MESSAGE);
        this.resetCalculator();
    },
    resetCalculator() {
        this.result = null;
        this.firstNumber = null;
        this.secondNumber = null;
        this.operation = null;
        this.addingToExistingNumber = false;
        this.showingFinalResult = false;
    },

    handleInput(buttonId, buttonType) { 
        if (buttonId === "clear") {
            this.clearDisplay("");
            return;
        }

        const currentState = this.detectState();
        const stateHandlers = {
            "Awaiting first number": () => this.handleAwaitingFirstNumber(buttonId, buttonType),
            "Adding to first number": () => this.handleAddingToFirstNumber(buttonId, buttonType),
            "Awaiting second number": () => this.handleAwaitingSecondNumber(buttonId, buttonType),
            "Adding to second number": () => this.handleAddingToSecondNumber(buttonId, buttonType),
            "Displaying final result": () => this.handleDisplayingFinalResult(buttonId, buttonType)
        }

        const handler = stateHandlers[currentState];
        if(handler) handler();
    },

    handleAwaitingFirstNumber(buttonId, buttonType) {
            if (buttonType === "number") {
                this.setFirstNumber(buttonId);
            } else if (buttonType === "dot") {
                this.setFirstNumber("0.");
            }
    },

    handleAddingToFirstNumber(buttonId, buttonType) {
        switch (buttonType) {
            case "number": 
                this.appendToFirstNumber(buttonId);
                break; 
            case "operation":
                this.setOperation(buttonId);
                break;
            case "dot":
                this.addDecimalToFirstNumber();
                break;
            case "delete":
                this.deleteFromFirstNumber();
                break;

        }
    },

    handleAwaitingSecondNumber(buttonId, buttonType) {
        if (buttonType ==="number") {
            this.setSecondNumber(buttonId);
        } else if (buttonType === "operation") {
            this.setOperation(buttonId);
        } else if (buttonType === "dot") {
            this.setSecondNumber("0.");
        }
    }, 

    handleAddingToSecondNumber(buttonId, buttonType) {
        switch(buttonType) {
            case "number":
                this.appendToSecondNumber(buttonId);
                break;
            case "operation":
                this.calculateAndContinue(buttonId);
                break;
            case "equals":
                this.calculateFinal();
                break;
            case "dot":
                this.addDecimalToSecondNumber();
                break; 
            case "delete": 
                this.deleteFromSecondNumber();
                break;
        }
    }, 

    handleDisplayingFinalResult(buttonId, buttonType) {
        switch (buttonType) {
            case "number":
                this.startFresh(buttonId);
                break;
            case "operation":
                this.continueFromResult(buttonId);
                break;
            case "dot": 
                this.startFreshWithDecimal();
                break;
        }
    },

    setFirstNumber(value) {
        this.firstNumber = value; 
        this.addingToExistingNumber = true; 
        this.showingFinalResult = false; 
        this.updateDisplay(this.firstNumber);
    },

    appendToFirstNumber(digit) {
        this.firstNumber = this.firstNumber === null ? digit : this.firstNumber + digit;
        this.addingToExistingNumber = true; 
        this.updateDisplay(this.firstNumber);
    },

    setSecondNumber(value) {
        this.secondNumber = value; 
        this.addingToExistingNumber = true; 
        this.updateDisplay(this.secondNumber);
    },

    appendToSecondNumber(digit) {
        this.secondNumber += digit; 
        this.updateDisplay(this.secondNumber);
    },

    setOperation(op) {
        this.operation = op; 
        this.addingToExistingNumber = false; 
    },

    addDecimalToFirstNumber() {
        if (!this.firstNumber.includes(".")) {
            this.firstNumber += ".";
            this.updateDisplay(this.firstNumber);
        }
    },

    addDecimalToSecondNumber() {
        if (!this.secondNumber.includes(".")) {
            this.secondNumber += ".";
            this.updateDisplay(this.secondNumber);
        }
    },

    deleteFromFirstNumber() {
        this.firstNumber = this.firstNumber.slice(0, -1);
        this.updateDisplay(this.firstNumber);
    },

    deleteFromSecondNumber() {
        this.secondNumber = this.secondNumber.slice(0, -1);
        this.updateDisplay(this.secondNumber);
    },

    calculateAndContinue(nextOperation) {
        this.calculate(this.firstNumber, this.operation, this.secondNumber);
        this.setOperation(nextOperation);
        this.showingFinalResult = false;
    },

    calculateFinal() {
        this.calculate(this.firstNumber, this.operation, this.secondNumber);
        this.operation = null;
        this.showingFinalResult = true;
    },

    startFresh(digit) {
        this.clearState();
        this.setFirstNumber(digit);
    },

    continueFromResult(operation) {
        this.setOperation(operation);
        this.showingFinalResult = false; 
    },

    startFreshWithDecimal() {
        this.clearState();
        this.setFirstNumber("0.");
    },

    clearState() {
        this.result = null; 
        this.secondNumber = null; 
        this.operation = null;
    },

    updateDisplay(displayOutput) {
        const display = document.querySelector('#expression');

        if(displayOutput === "" || displayOutput === this.DIVIDE_BY_ZERO_MESSAGE || displayOutput === "0.") {
            display.innerText = displayOutput;
            return;
        }

        if(typeof displayOutput === "string") {
            display.innerText = displayOutput;
            return;
        }
        
        if(typeof displayOutput === "number") {
        this.result = displayOutput;
        const roundedNumber = parseFloat(displayOutput.toFixed(this.DECIMAL_PLACES));
        display.innerText = roundedNumber; //limit to 5 after decimal;
        return;
        }
    },

    clearDisplay() {
        this.resetCalculator();
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

        const mapping = keyMappings[key];  
        if (mapping) {
            this.handleInput(mapping.id, mapping.type);
        }
    },
}

const buttons = document.querySelectorAll('.btn');
buttons.forEach(element => {
    element.addEventListener('click', (event) => {
        calculator.handleInput(event.target.id, event.target.dataset.type);
    });
});

document.addEventListener('keydown', (event) => {
    const pressedKey = event.key;
    const validOpKeys = ['-', '+', '*', '/', '=','.', 'Enter'];
    if((pressedKey >= '0' && pressedKey <= '9') || validOpKeys.includes(pressedKey)) {
        calculator.handleKeyPress(pressedKey);
    }
});