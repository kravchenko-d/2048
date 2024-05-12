class Game2048 {
    field = null
    score = 2
    #time = null // ? / ES2019
    player = " "
    app = null
    #maxScore = 2048
    history = []
    #startNumbers = [2, 2, 2, 4, 8, 16]
    #scoreElement = document.createElement("div")
    #stepBackElement = document.createElement("button") //
    #fieldElement = document.createElement("div")
    #resultElement = document.createElement("div") //
    #popup = null
    #canMove = true
    #results = []
    #keyClick = null

    get time(){
        return this.#time
    }

    set time(val) {
        this.#time = val
    }

    constructor(appId, player, popup = null){
        this.app = document.getElementById(appId)
        this.player = player

        if(popup){
            this.#popup = popup
        }

        this.#fieldElement.classList.add('field')
        this.field = new Field(this.#fieldElement, 4, this.#startNumbers)

        this.app.appendChild(this.#scoreElement)
        this.app.appendChild(this.#stepBackElement) //
        this.app.appendChild(this.#fieldElement)
        this.app.appendChild(this.#resultElement) //

        this.#keyClick = (event) => this.#move(event)

        document.body.addEventListener("keyup", this.#keyClick)

    }

    init(){
        this.#render()

        // this.gameOver()
    }
    #render(){ // ? / ES2019
        this.showField()
        this.showScore()
        this.showTime()
        this.saveResult() //
        this.showStepBack() ///
    }

    gameOver(){

        document.body.removeEventListener("keyup", this.#keyClick)

        if(this.#popup) {
            const body = document.createElement("div")
            body.innerHTML = `
            <div style="text-align: center; font-weight: 800">You are loser</div>
            <div style="text-align: center">Your score is ${this.score}</div> 
            `

            const el = document.createElement("div")
            el.appendChild(body)

            const input = document.createElement("input")
            el.appendChild(input)

            this.#popup.content = el
            this.#popup.actions = {
                newGame: {
                    label: "new game",
                    action: (event) => {
                        const name = input.value

                        const item = {
                            player: name,
                            score: this.score
                        }

                        if(this.#results.length === 0){
                            this.#results.push(item)
                        }
                        else {
                            let insertIndex = -1
                            for(let i = 0; i < this.#results.length && insertIndex === -1; i++){
                                if(this.#results[i].score < item.score){
                                    insertIndex = i
                                }
                            }
                            if(insertIndex = -1){
                                this.#results.push(item)
                            }
                            else{
                                this.#results.splice(insertIndex, 0, item)
                            }
                        }
                        // this.#results.sort(function(a, b) {
                        //     if (a.score > b.score) {
                        //         return 1
                        //     }
                        //     if (a.score < b.score) {
                        //         return -1
                        //     }

                        //     return 0
                        // })
                        // Обновление таблицы результатов --> Game
                        this.saveResult()

                        this.#popup.hide()
                        this.#canMove = true
                        this.restartGame()
                    }
                }
            }
            this.#popup.show()
            // this.#canMove = false
            // setTimeout(
            //     () => {
            //         this.#popup.hide()
            //         this.#canMove = true
            //         this.restartGame()
            //     },
            //     5000
            // )
        }
    }
    checkWin(){
        if(this.#popup){
            if(this.score >= this.#maxScore){
                this.#popup.addContentToBody(`
                <div style="text-align: center; font-weight: 800">You are WINNER</div>
                <div style="text-align: center">Your score is ${this.score}</div> 
                `)
                this.#popup.show()
                this.#canMove = false
                this.restartGame()
                setTimeout(
                    () => {
                        this.#popup.hide()                        
                        this.#canMove = true
                        this.restartGame()
                    },
                    5000
                )
            }
            else if (!this.#isCanStep()){
                this.gameOver()
            }
        }
    }
    restartGame(){
        this.field.refreshCells([2, 2, 4, 4, 16])
        document.body.addEventListener("keyup", this.#keyClick)
    }

    showStepBack(){
        this.#stepBackElement.innerText = true
        this.#stepBackElement.innerText = "Шаг назад"
        this.#stepBackElement.addEventListener("click", event => this.stepBack(event))
    }
    stepBack(event){
        // unshift <=> push
        // shift <=> pop

        // this.history => stack => first in - last out
        if (this.history.length > 0) {
            const step = this.history.pop()
            for (let i = 0; i < step.length; i++){
                for (let j = 0; j < step[i].length; j++){
                    this.field.cells[i][j].number = step[i][j]
                }
            }
            this.#stepBackElement.disabled = false
        }
        else {
            this.#stepBackElement.disabled = true
        }
        // button.disabled = true | false
        // this.history = []
    }

    #saveHistory(){
        const step = []
        for (let row of this.field.cells){
            const aRow = []
            for (let cell of row){
                aRow.push(cell.number)
            }
            step.push(aRow)
        }
        if(this.history.length >= 5){
            //this.history.splice(0, 1)
            this.history.shift(0)
        }
        this.history.push(step)
        this.#stepBackElement.disabled = false
    }

    #move(event){
        // for (let i = 0; i < 4; i++){
        //     for (let j = 0; j < 4; j++){
        //         this.history.push(this.field.cells[i][j].number)
        //         console.log(this.history)
        //     }
        // }
        if(this.#canMove){
        
        const controls = ["KeyW", "KeyS", "KeyD", "KeyA", "ArrowUp", "ArrowDown", "ArrowRight", "ArrowLeft"]

        if(controls.includes(event.code)){

            this.#saveHistory()

            switch(event.code){
            case "KeyW", "ArrowUp":
                this.#moveTop()
                break
            case "KeyS", "ArrowDown":
                this.#moveBottom()
                break
            case "KeyD", "ArrowRight":
                this.#moveRight()
                break
            case "KeyA", "ArrowLeft":
                this.#moveLeft()                
                break
        }
        this.field.addNewNumber()
    }
    }
        this.showScore()

        this.checkWin()
    }

    #isCanStep(){
        let res = false
        for(let i = this.field.cells.length - 1; i > 0 && !res; i--){
            for(let j = 0; j < this.field.cells[i].length && !res; j++) {
                if(this.field.cells[i][j].number === null ||
                    this.field.cells[i - 1][j].number !== null &&
                        this.field.cells[i][j].number === this.field.cells[i - 1][j].number
                    ){
                        res = true
                    }
                }
            }
        for(let i = 0; i < this.field.cells.length - 1 && !res; i++){
            for(let j = 0; j < this.field.cells[i].length && !res; j++) {
                if(this.field.cells[i][j].number !== null){
                    if(this.field.cells[i + 1][j].number !== null &&
                            this.field.cells[i][j].number === this.field.cells[i + 1][j].number
                        ){
                            res = true
                        }
                }
            }
        }
        for(let j = 0; j < this.field.cells[0].length - 1 && !res; j++){
            for(let i = 0; i < this.field.cells.length && !res; i++){
               if(this.field.cells[i][j].number !== null){
                    if(this.field.cells[i][j + 1].number !== null &&
                            this.field.cells[i][j].number === this.field.cells[i][j + 1].number
                        ){
                            res = true
                        }
            }
        }
        }
        for(let j = this.field.cells[0].length - 1; j > 0 && !res; j--){
            for(let i = 0; i < this.field.cells.length && !res; i++){
                if(this.field.cells[i][j].number !== null){
                    if(this.field.cells[i][j - 1].number !== null &&
                            this.field.cells[i][j].number === this.field.cells[i][j - 1].number
                        ){
                            res = true
                        }
            }
        }
    }
        return res
    }

    #moveTop(){
        for(let i = this.field.cells.length - 1; i > 0; i--){
            for(let j = 0; j < this.field.cells[i].length; j++) {
                if(this.field.cells[i][j].number !== null){
                    if(this.field.cells[i - 1][j].number !== null &&
                        this.field.cells[i][j].number === this.field.cells[i - 1][j].number
                    ){
                        this.field.cells[i - 1][j].number *= 2
                        this.field.cells[i][j].number = null
                    }
                    else if(this.field.cells[i - 1][j].number === null){
                        this.field.cells[i - 1][j].number = this.field.cells[i][j].number
                        this.field.cells[i][j].number = null
                    }
                }
            }
        }
    }

    #moveBottom(){
        for(let i = 0; i < this.field.cells.length - 1; i++){
            for(let j = 0; j < this.field.cells[i].length; j++) {
                if(this.field.cells[i][j].number !== null){
                    if(this.field.cells[i + 1][j].number !== null &&
                        this.field.cells[i][j].number === this.field.cells[i + 1][j].number
                    ){
                        this.field.cells[i + 1][j].number *= 2
                        this.field.cells[i][j].number = null
                    }
                    else if(this.field.cells[i + 1][j].number === null){
                        this.field.cells[i + 1][j].number = this.field.cells[i][j].number
                        this.field.cells[i][j].number = null
                    }
                }
            }
        }
    }

    #moveRight(){
        for(let j = 0; j < this.field.cells[0].length - 1; j++){
            for(let i = 0; i < this.field.cells.length; i++){
                if(this.field.cells[i][j].number !== null){
                    if(this.field.cells[i][j + 1].number !== null &&
                        this.field.cells[i][j].number === this.field.cells[i][j + 1].number
                    ){
                        this.field.cells[i][j + 1].number *= 2
                        this.field.cells[i][j].number = null
                    }
                    else if(this.field.cells[i][j + 1].number === null){
                        this.field.cells[i][j + 1].number = this.field.cells[i][j].number
                        this.field.cells[i][j].number = null
                    }
                }
            }
        }
    }

    #moveLeft(){
        for(let j = this.field.cells[0].length - 1; j > 0; j--){
            for(let i = 0; i < this.field.cells.length; i++){
                if(this.field.cells[i][j].number !== null){
                    if(this.field.cells[i][j - 1].number !== null &&
                        this.field.cells[i][j].number === this.field.cells[i][j - 1].number
                    ){
                        this.field.cells[i][j - 1].number *= 2
                        this.field.cells[i][j].number = null
                    }
                    else if(this.field.cells[i][j - 1].number === null){
                        this.field.cells[i][j - 1].number = this.field.cells[i][j].number
                        this.field.cells[i][j].number = null
                    }
                }
            }
        }
    }

    showScore(){
        let max = 2
        for(let i = 0; i < this.field.cells.length; i++){
            for(let j = 0; j < this.field.cells[i].length ; j++){
                if(this.field.cells[i][j].number !== null && this.field.cells[i][j].number > max){
                    max = this.field.cells[i][j].number
                }
            }
        }
        this.score = max

        this.#scoreElement.innerText = `Score: ${this.score}`
    }

    showField(){
        this.field.render(this.#fieldElement)
    }

    showTime(){}

    saveResult(){
        let str = ""

        // for(let i = 0; i < this.#results.length; i++){
        //     for(let j = 0; j < this.#results.length; j++){
        //         if(this.#results[i].score > this.#results[j].score){
        //             const temp = this.#results[j]
        //             this.#results[j] = this.#results[i]
        //             this.#results[i] = temp
        //         }
        //     }
        // }

        this.#results.sort((a, b) => b.score - a.score)

          for(let i of this.#results){
                str += i.player + ": " + i.score + "</br>"
          }   
          this.#resultElement.innerHTML = str
    }
}

class Field {
    // свойства - локальные переменные
    cells = []
    field = null
    
    // методы
    constructor(field, size, startNumbers = []) { // этот player отличается от player в свойствах
        // this - внутренности экземпляра класса. В нем есть методы и свойства
        this.field = field
        this.field.style.width = size * 100 + "px"
        this.initCells(size, startNumbers)
    } // return Object === Field ==> this

    initCells(size, startNumbers){
        const border = "1px solid rgba(0, 0, 0, 0.4)"
        for(let i = 0; i < size; i++){
            const row = []
            for(let j = 0; j < size; j++){
                const style = {}
                if(j < size - 1){
                    style.borderRight = border
                }
                if(i < size - 1){
                    style.borderBottom = border
                }

                let num = null

                const n = Math.round(Math.random() * 100 + 1)

                const isNeedAdd = Math.round(Math.random() * 100 + 1) % 8 > 4

                if(startNumbers.length > 0 && isNeedAdd){
                    const index = Math.round(Math.random() * (startNumbers.length - 1))
                    // console.log(startNumbers.length, index)
                    num = startNumbers.splice(index, 1)[0]
                }
                
                let cell

                // if(n % 3 === 0){
                cell = new Cell(new Position(i, j), num, "cell", style)
                // }
                // else if(n % 3 === 1) {
                //     cell = new OtherColorCell(new Position(i, j), num, "cell", style)
                // }
                // else {
                //     cell = new BlackCell(new Position(i, j), num, "cell", style)
                // }

                row.push(cell)
            }
            this.cells.push(row)
        }
        // this.addNewNumber()
        
        // setInterval (
        //     () => this.addNewNumber(),
        //     500
        // )

    }

    refreshCells(startNumbers = []){
        for (let row of this.cells){
            for (let cell of row){
                let num = null

                const n = Math.round(Math.random() * 100 + 1)

                const isNeedAdd = Math.round(Math.random() * 100 + 1) % 8 > 4

                if(startNumbers.length > 0 && isNeedAdd){
                    const index = Math.round(Math.random() * (startNumbers.length - 1))
                    num = startNumbers.splice(index, 1)[0]
                }

                cell.number = num
            }
        }
    }

    addNewNumber(){
        const emptyCells = this.cells.flat().filter(cell => cell.number === null)
        const index = Math.round(Math.random() * (emptyCells.length - 1))

        if(index >= 0 && emptyCells[index]){
        emptyCells[index].number = 2

        // emptyCells[index].element.style.color = "black"

        return true
        }

        return false
    }

    render (app){
        for(let i = 0; i < this.cells.length; i++){
            for(let j = 0; j < this.cells[i].length; j++){
                app.appendChild(this.cells[i][j].element)
            }
        }
    }
}

class Cell {
    element = document.createElement("div")
    #number = 2
    position = new Position()

    get number() {
        return this.#number
    }

    set number(num) {
        this.#number = num
        this.element.innerText = this.#number
        this.element.style.color = this.getColor()
    }

    constructor(position, number = 2, className = "cell", style = {}) {
        this.position = position
        this.#number = number

        this.element.classList.add(className)

        this.element.innerText = number

        for(let key in style) {
            this.element.style[key] = style[key] //style = {width: "100%"} ==> key = "width"
        }

        if(this.#number){
            this.element.innerText = this.#number
            this.element.style.color = this.getColor()
        }

        this.element.style.color = this.getColor()

        this.element.addEventListener("click", event => this.onClick(event))
    }

    onClick(event) {}
    clear() {}
    render() {}

    getColor(){
        const num = Math.log2(this.#number)
        const step = 255 / 10
        const middleStep = 255 / 2 / 10

        // rgb(255, (255 / 4)), 0) -> rgb(0, (255 / 4)), 255)

        const red = step * (11 - num),
              green = (255 / 4) + (middleStep * (num - 1)),
              blue = step * (num - 1)

        return `rgb(${red}, ${green}, ${blue})`
    }
}

class BlackCell extends Cell {
    constructor (position, number = 2, className = "cell", style = {}){
        super (position, number, className, style)

        this.element.style.backgroundColor = "rgba(0,0,0,.4)"
    }
}

class OtherColorCell extends Cell {
    getColor(){
        const num = Math.log2(this.number)
        const step = 255 / 10
        const middleStep = step / 2

        // rgb(255, (255 / 4)), 0) -> rgb(0, 4 * 3), 255)
        // rgb(255 / 4), 0, 255) -> rgb(255 / 4 * 3, 255, 0)

        const blue = step * (11 - num),
              red = (255 / 4) + (middleStep * (num - 1)),
              green = step * (num - 1)

        return `rgb(${red}, ${green}, ${blue})`
    }
}

class Position {
    x = 0
    y = 0

    constructor(x = 0, у = 0) {
        this.x = x
        this.у = у
    }
}


/*
<div class="wrapper-popup"> // wrapper
    <div>
        <div class="popup-body"></div> // body
        <div></div>... // buttons
    </div>
</div>
*/

class Popup {
    #wrapper = document.createElement("div")
    #body = document.createElement("div")
    #actions = document.createElement("div")

    set actions(actions){
        this.#actions.innerText = ""
        for(let key in actions) {
            const action = actions[key]
            if(action.action){
                const button = document.createElement("div")
                button.classList.add('button')
                button.innerText = action.label || key // action.label !== undefined ? action.label : key
                button.addEventListener('click', (event) => action.action(event))

                this.#actions.appendChild(button)
            }
        }
    }

    set content(element) {
        this.#body.innerText = ""
        this.#body.appendChild(element)
    }

    constructor(actions = {}) {
       // создаем всю структуру элемента, как раньше делали в html
        this.#wrapper.classList.add("wrapper-popup")
        this.#body.classList.add("popup-body")
        this.#actions.classList.add("popup-actions")

        this.actions = actions

        const popupContent = document.createElement("div")
        
        popupContent.appendChild(this.#body)
        popupContent.appendChild(this.#actions)

       // добавляем обработчики на закрытие
       // привязка действий к кнопкам
    //    if(Object.keys(actions).length > 0){

    //     }
       this.#wrapper.appendChild(popupContent)

       document.body.appendChild(this.#wrapper)
    }
    
    show(){
        this.#wrapper.style.display = "flex"
    }
    hide(){
        this.#wrapper.style.display = "none"
    }

    addContentToBody(content) {
        this.#body.innerHTML = content
    }
}

const popup = new Popup()
// popup.show()

const game = new Game2048("app", "player", popup)
game.init()

// game.#time // Error -> private
// game.field // OK -> public
// game.#render() // Error -> private

game.time // OK -> get time()
game.time = "some time" // OK -> set time(val) -> val = "some time"