class GameController {
    constructor(model, view, ai) {
        this.model = model;
        this.view = view;
        this.ai = ai;
        this.isAITurn = false;

        this.view.bindCellClick(this.handleCellClick.bind(this));
        this.view.bindResetButton(this.handleReset.bind(this));

        this.updateView();
    }

    handleCellClick(row, col) {
        if (this.isAITurn) return; // 如果是 AI 的回合，忽略玩家的點擊

        if (this.model.makeMove(row, col)) {
            this.updateView();
            if (this.model.checkWin(row, col)) {
                this.view.showWinner(this.model.currentPlayer === 'black' ? 'white' : 'black');
                this.handleReset();
            } else {
                this.makeAIMove();
            }
        }
    }

    makeAIMove() {
        this.isAITurn = true;
        this.view.disableBoard(); // 禁用棋盤

        const aiMove = this.ai.makeMove();
        if (aiMove) {
            setTimeout(() => {
                if (this.model.makeMove(aiMove.row, aiMove.col)) {
                    this.updateView();
                    if (this.model.checkWin(aiMove.row, aiMove.col)) {
                        this.view.showWinner(this.model.currentPlayer === 'black' ? 'white' : 'black');
                        this.handleReset();
                    }
                }
                this.isAITurn = false;
                this.view.enableBoard(); // 重新啟用棋盤
            }, 500);
        } else {
            this.isAITurn = false;
            this.view.enableBoard(); // 重新啟用棋盤
        }
    }

    handleReset() {
        this.model.resetGame();
        this.isAITurn = false;
        this.view.enableBoard();
        this.updateView();
    }

    updateView() {
        this.view.renderBoard(this.model.board);
        this.view.updateCurrentPlayer(this.model.currentPlayer);
    }
}

// 初始化遊戲
const gameModel = new GameModel();
const gameView = new GameView();
const gameAI = new AI(gameModel);
const game = new GameController(gameModel, gameView, gameAI);