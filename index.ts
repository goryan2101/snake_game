import $ from "jquery"

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;
const width = canvas.width
const height = canvas.height
const blockSize = 10
const widthInBlocks = width / blockSize
const heightInBlocks = height / blockSize
let score = 0

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
        this.segments.forEach((i) => {i.drawSquare("Blue")})
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
            newHead = new Block(head.col + 1, head.row)
        } else {
            newHead = new Block(1, 1)
        }

        // if (this.checkCollision(newHead)) {
        //     gameOver()
        //     return
        // }

        this.segments.unshift(newHead)

        /*
        if (newHead.equeal(apple.position)) {
            score++
            apple.move()
        } else {
            this.segments.pop()     
        }
        */
    }

    public checkCollision(head: Block) {
        let selfCollision: boolean
        for (let i = 0; i < this.segments.length; i++) {
            if (head.equeal(this.segments[i])) {
                selfCollision = true
            }
        }
        const wallCollision = (head.col === 0) || (head.row === 0) || (head.col === widthInBlocks - 1) || (head.row === heightInBlocks - 1)
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
    clearInterval(intervalId)
    ctx.font = "60px Courier"
    ctx.fillStyle = "Black"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText("Game Over", width / 2, height / 2)
}

const sampleBlock = new Block(20, 20)
const sampleCircle = new Block(4, 3)
const snake = new Snake()

const intervalId = setInterval(function () {
    ctx.clearRect(0, 0, width, height)
    score++
    drawScore()
    drawBorder()
    snake.draw()
    sampleBlock.drawSquare("Red")
    sampleCircle.drawCircle("Green")
}, 100)