class AI {
    constructor(gameModel) {
        this.gameModel = gameModel;
    }

    makeMove() {
        const emptyPositions = this.getEmptyPositions();
        if (emptyPositions.length === 0) return null;

        // 簡單的 AI 策略：隨機選擇一個空位置
        const randomIndex = Math.floor(Math.random() * emptyPositions.length);
        return emptyPositions[randomIndex];
    }

    getEmptyPositions() {
        const emptyPositions = [];
        for (let i = 0; i < this.gameModel.boardSize; i++) {
            for (let j = 0; j < this.gameModel.boardSize; j++) {
                if (this.gameModel.board[i][j] === null) {
                    emptyPositions.push({ row: i, col: j });
                }
            }
        }
        return emptyPositions;
    }
}