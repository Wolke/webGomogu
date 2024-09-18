class GameView {
    constructor() {
        this.gameBoard = document.getElementById('game-board');
        this.currentPlayerDisplay = document.getElementById('current-player');
        this.resetButton = document.getElementById('reset-btn');
    }

    renderBoard(board) {
        this.gameBoard.innerHTML = '';
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.row = i;
                cell.dataset.col = j;
                if (board[i][j]) {
                    cell.classList.add(board[i][j]);
                }
                this.gameBoard.appendChild(cell);
            }
        }
    }

    updateCurrentPlayer(player) {
        this.currentPlayerDisplay.textContent = player === 'black' ? '黑子' : '白子';
    }

    bindCellClick(handler) {
        this.gameBoard.addEventListener('click', (e) => {
            if (e.target.classList.contains('cell')) {
                const row = parseInt(e.target.dataset.row);
                const col = parseInt(e.target.dataset.col);
                handler(row, col);
            }
        });
    }

    bindResetButton(handler) {
        this.resetButton.addEventListener('click', handler);
    }

    showWinner(player) {
        alert(`遊戲結束！${player === 'black' ? '黑子' : '白子'}獲勝！`);
    }
}