class GameModel {
    constructor() {
        this.boardSize = 15;  // 改為 15x15 的棋盤
        this.board = Array(this.boardSize).fill().map(() => Array(this.boardSize).fill(null));
        this.currentPlayer = 'black';
    }

    makeMove(row, col) {
        if (this.board[row][col] === null) {
            this.board[row][col] = this.currentPlayer;
            this.currentPlayer = this.currentPlayer === 'black' ? 'white' : 'black';
            return true;
        }
        return false;
    }

    checkWin(row, col) {
        const directions = [
            [1, 0], [0, 1], [1, 1], [1, -1]
        ];

        for (let [dx, dy] of directions) {
            let count = 1;
            count += this.countDirection(row, col, dx, dy);
            count += this.countDirection(row, col, -dx, -dy);

            if (count >= 5) {
                return true;
            }
        }
        return false;
    }

    countDirection(row, col, dx, dy) {
        const player = this.board[row][col];
        let count = 0;
        let x = row + dx;
        let y = col + dy;

        while (x >= 0 && x < this.boardSize && y >= 0 && y < this.boardSize && this.board[x][y] === player) {
            count++;
            x += dx;
            y += dy;
        }

        return count;
    }

    resetGame() {
        this.board = Array(this.boardSize).fill().map(() => Array(this.boardSize).fill(null));
        this.currentPlayer = 'black';
    }
}