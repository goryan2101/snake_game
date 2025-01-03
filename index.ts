import $ from "jquery"

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;
const width = canvas.width
const height = canvas.height
const blockSize = 10
const widthInBlocks = width / blockSize
const heightInBlocks = height / blockSize
let score = 0
let animationTime = 200
let isGameOver = false

enum Direction {
    Right,
    Left,
    Up,
    Down
}

class Block {
    col: number
    row: number
    constructor(col: number, row: number) {
        this.col = col
        this.row = row
    }

    public drawSquare(color: string) {
        ctx.fillStyle = color
        ctx.fillRect(this.col * blockSize, this.row * blockSize, blockSize, blockSize)
    }

    public drawCircle(color: string) {
        const centerX = this.col * blockSize + blockSize / 2
        const centerY = this.row * blockSize + blockSize / 2
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(centerX, centerY, blockSize / 2, 0, Math.PI * 2, false)
        ctx.fill()
    }

    public equeal(anotherBlock: Block): boolean {
        return this.col === anotherBlock.col && this.row === anotherBlock.row
    }
}

class Snake {
    public segments: Block[]
    direction: Direction
    nextDirection: Direction
    constructor() {
        this.segments = [
            new Block(7, 5),
            new Block(6, 5),
            new Block(5, 5)
        ]
        this.direction = Direction.Right
        this.nextDirection = Direction.Right
    }

    public draw() {
        for (let i = 0; i < this.segments.length; i++) {
            let color: string
            if (i === 0) {
                color = "LimeGreen"
            } else if (i % 2 === 0) {
                color = "Yellow"
            } else {
                color = "Blue"
            }
            this.segments[i].drawSquare(color)
        }
    }

    public move() {
        const head = this.segments[0]
        let newHead: Block
        this.direction = this.nextDirection

        if (this.direction === Direction.Right) {
            newHead = new Block(head.col + 1, head.row)
        } else if (this.direction === Direction.Down) {
            newHead = new Block(head.col, head.row + 1)
        } else if (this.direction === Direction.Up) {
            newHead = new Block(head.col, head.row - 1)
        } else if (this.direction === Direction.Left) {
            newHead = new Block(head.col - 1, head.row)
        } else {
            newHead = new Block(1, 1)
        }

        if (this.checkCollision(newHead)) {
            gameOver()
            isGameOver = true
            return
        }

        this.segments.unshift(newHead)

        if (newHead.equeal(apple.position)) {
            score++
            apple.move()
            if (animationTime !== 1) {
                animationTime -= 3
                console.log("Animation time: " + animationTime)
            }
        } else {
            this.segments.pop()     
        }
    }

    public checkCollision(head: Block) {
        let selfCollision = false
        for (let i = 0; i < this.segments.length; i++) {
            if (head.equeal(this.segments[i])) {
                selfCollision = true
            }
        }
        const wallCollision = (head.col === 0) || (head.row === 0) || (head.col === widthInBlocks - 1) || (head.row === heightInBlocks - 1)
        return wallCollision || selfCollision
    }

    public setDirection(newDirection: Direction) {
        if (this.direction === Direction.Down && newDirection === Direction.Up) { return } 
        else if (this.direction === Direction.Up && newDirection === Direction.Down) { return }
        else if (this.direction === Direction.Left && newDirection === Direction.Right) { return }
        else if (this.direction === Direction.Right && newDirection === Direction.Left) { return }
        this.nextDirection = newDirection
    }
}

class Apple {
    position: Block
    constructor() {
        this.position = new Block(8, 5)
    }

    public draw() {
        this.position.drawCircle("Red")
    }

    public move() {
        let newPosition;
        do {
            newPosition = new Block(
                Math.floor(Math.random() * (widthInBlocks - 2)) + 1,
                Math.floor(Math.random() * (heightInBlocks - 2)) + 1
            );
        } while (snake.segments.some(segment => segment.equeal(newPosition)));
        this.position = newPosition;
    }
}

function drawBorder() {
    ctx.fillStyle = "Gray"
    ctx.fillRect(0, 0, width, blockSize)
    ctx.fillRect(0, height - blockSize, width, blockSize)
    ctx.fillRect(0, 0, blockSize, height)
    ctx.fillRect(width - blockSize, 0, blockSize, height)
}

function drawScore() {
    ctx.textBaseline = "top"
    ctx.textAlign = "left"
    ctx.font = "20px Courier"
    ctx.fillStyle = "Black"
    ctx.fillText("Score: " + score.toString(), blockSize + 1, blockSize + 1)
}

function gameOver() {
    ctx.font = "60px Courier"
    ctx.fillStyle = "Black"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText("Game Over", width / 2, height / 2)
}

function keyToDirection(key: string): Direction {
    switch (key) {
        case "w":
        case "ArrowUp":
            return Direction.Up
        case "s":
        case "ArrowDown":
            return Direction.Down
        case "a":
        case "ArrowLeft":
            return Direction.Left
        case "d":
        case "ArrowRight":
            return Direction.Right
        default:
            return snake.direction
    }
}

function drawChessboard() {
    for (let row = 0; row < heightInBlocks; row++) {
        for (let col = 0; col < widthInBlocks; col++) {
            if (row % 2 === 0) {
                if (col % 2 !== 0) {
                    new Block(col, row).drawSquare("LightGray")
                }
            } else {
                if (col % 2 === 0) {
                    new Block(col, row).drawSquare("LightGray")
                }
            }
        }
    }
}

const snake = new Snake()
const apple = new Apple()

$("body").on("keydown", function (e) {
    const dir = keyToDirection(e.key)
    snake.setDirection(dir)
    console.log("Key: " + e.key)
    console.log("Direction in tracker: " + dir)
})

const gameLoop = function () {
    ctx.clearRect(0, 0, width, height)
    drawChessboard()
    drawScore()
    snake.move()
    snake.draw()
    apple.draw()
    drawBorder()
    console.log("Snake direction: " + snake.direction.toString())
    if (isGameOver) {
        return
    }
    setTimeout(gameLoop, animationTime)
}

gameLoop()