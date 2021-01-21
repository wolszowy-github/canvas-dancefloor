class Square {
    constructor(x, y) {
        this.color = this.randomColor();
        this.x = x;
        this.y = y; 
    }

    draw = (ctx, squareSize) => {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, squareSize, squareSize);
    }

    clickSquare = (x, y, squareSize) => {
        if ((x >= this.x && x <= this.x + squareSize) && (y >= this.y && y <= this.y + squareSize)) {
            this.color = this.randomColor()
        } 
    }

    randomColor = () => {
        return '#'+ Math.floor(Math.random() * 16777215).toString(16);
    }
}

class App {
    constructor() {
        this.rowsDisplay = document.getElementById('current-rows-container');
        this.colsDisplay = document.getElementById('current-columns-container');
        this.modal = document.getElementById('modal')
        this.modalInput = document.getElementById('modal-input');
        this.colBtn = document.getElementById('col-btn');
        this.rowBtn = document.getElementById('row-btn');
        this.enterValueBtn = document.getElementById('enter-value');
        this.generateBtn = document.getElementById('generate-btn');
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.rowsAmount = 0;
        this.colsAmount = 0;
        this.currentModalValueId = null;
        this.squaresArray = [];
        this.squareSize = 100;
    }
     
    setupCanvasSize = (cols, rows) => {
        this.canvas.width = cols * this.squareSize 
        this.canvas.height = rows * this.squareSize; 
    }

    drawDancefloor = () => {
        this.setupCanvasSize(this.colsAmount, this.rowsAmount)
        this.squaresArray.forEach(square => square.draw(this.ctx, this.squareSize))
    }

    setSquaresArray = () => {
        for (let i = 0; i < this.colsAmount; i++) {
            for (let j = 0; j < this.rowsAmount; j++) {
                const square = new Square(i * this.squareSize, j * this.squareSize);
                this.squaresArray.push(square);
            }
        }
    }

    openModal = (e) => {
        this.currentModalValueId = e.target.id;
        this.modal.style.display = 'flex'
    }

    enterValue = () => {
        const inputValue = +this.modalInput.value;

        if (!inputValue) {
            return
        }

        if (this.currentModalValueId === 'col-btn') {
            this.colsAmount = inputValue
        } else {
            this.rowsAmount = inputValue;
        }
        this.currentModalValueId = null;
        this.modal.style.display = "none";
        this.modalInput.value = '';
        this.renderSettingsInfo()
    }

    changeSquareColor = (event) => {
        const rect = canvas.getBoundingClientRect()
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        this.squaresArray.forEach(square => {
            square.clickSquare(x, y, this.squareSize)
        })

        this.drawDancefloor()
    }

    generateSquares = () => {
        this.setSquaresArray();
        this.drawDancefloor();
        this.saveSquaresPreset()
    }
    
    saveSquaresPreset = () => {
        const preset = {
            rows: this.rowsAmount,
            cols: this.colsAmount
        }

        localStorage.setItem('squaresPreset', JSON.stringify(preset))
    }

    renderSettingsInfo = () => {
        this.colsDisplay.innerText = this.colsAmount;
        this.rowsDisplay.innerText = this.rowsAmount;
    }

    fetchPreset = () => {
       const fetch = new Promise((resolve) => {
            setTimeout(() => {
                resolve(localStorage.getItem("squaresPreset"));
            }, 1000)
        })

        fetch.then((response) => {
            const { rows, cols } = JSON.parse(response)
            this.colsAmount = cols
            this.rowsAmount = rows;
            this.generateSquares()
            this.renderSettingsInfo()
        })
    }

    init = () => {
        this.fetchPreset()
        this.colBtn.addEventListener('click', this.openModal)
        this.rowBtn.addEventListener("click", this.openModal);
        this.enterValueBtn.addEventListener('click', this.enterValue)
        this.generateBtn.addEventListener('click', this.generateSquares)
        this.canvas.addEventListener("click", this.changeSquareColor);
    }
}

const instance = new App()
instance.init()