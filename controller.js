class GameController {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.view.bindCellClick(this.handleCellClick.bind(this));
        this.view.bindResetButton(this.handleReset.bind(this));

        this.updateView();
    }

    handleCellClick(row, col) {
        if (this.model.makeMove(row, col)) {
            this.updateView();
            if (this.model.checkWin(row, col)) {
                this.view.showWinner(this.model.currentPlayer === 'black' ? 'white' : 'black');
                this.handleReset();
            }
        }
    }

    handleReset() {
        this.model.resetGame();
        this.updateView();
    }

    updateView() {
        this.view.renderBoard(this.model.board);
        this.view.updateCurrentPlayer(this.model.currentPlayer);
    }
}

// 初始化遊戲
const game = new GameController(new GameModel(), new GameView());