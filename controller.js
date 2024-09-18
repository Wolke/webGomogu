class GameController {
    constructor(model, view, ai) {
        this.model = model;
        this.view = view;
        this.ai = ai;
        this.isAITurn = false;
        this.gameMode = 'human-vs-human';

        this.view.bindCellClick(this.handleCellClick.bind(this));
        this.view.bindResetButton(this.handleReset.bind(this));
        this.view.bindModeSelection(this.handleModeSelection.bind(this));

        this.updateView();
    }

    handleModeSelection(mode) {
        this.gameMode = mode;
        this.handleReset();
        if (mode === 'ai-black' || mode === 'ai-vs-ai') {
            this.makeAIMove();
        }
    }

    handleCellClick(row, col) {
        if (this.isAITurn) return;

        if (this.model.makeMove(row, col)) {
            this.updateView();
            if (this.model.checkWin(row, col)) {
                this.view.showWinner(this.model.currentPlayer === 'black' ? 'white' : 'black');
                this.handleReset();
            } else {
                this.checkAITurn();
            }
        }
    }

    checkAITurn() {
        if (
            (this.gameMode === 'ai-black' && this.model.currentPlayer === 'black') ||
            (this.gameMode === 'ai-white' && this.model.currentPlayer === 'white') ||
            this.gameMode === 'ai-vs-ai'
        ) {
            this.makeAIMove();
        }
    }

    makeAIMove() {
        this.isAITurn = true;
        this.view.disableBoard();

        const aiMove = this.ai.makeMove();
        if (aiMove) {
            setTimeout(() => {
                if (this.model.makeMove(aiMove.row, aiMove.col)) {
                    this.updateView();
                    if (this.model.checkWin(aiMove.row, aiMove.col)) {
                        this.view.showWinner(this.model.currentPlayer === 'black' ? 'white' : 'black');
                        this.handleReset();
                    } else if (this.gameMode === 'ai-vs-ai') {
                        this.makeAIMove();
                    }
                }
                this.isAITurn = false;
                this.view.enableBoard();
            }, 500);
        } else {
            this.isAITurn = false;
            this.view.enableBoard();
        }
    }

    handleReset() {
        this.model.resetGame();
        this.isAITurn = false;
        this.view.enableBoard();
        this.updateView();
        if (this.gameMode === 'ai-black' || this.gameMode === 'ai-vs-ai') {
            this.makeAIMove();
        }
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