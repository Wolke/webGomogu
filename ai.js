class AI {
    constructor(gameModel) {
        this.gameModel = gameModel;
        this.maxDepth = 3; // 根据性能调整
        this.cache = new Map();
    }

    makeMove() {
        const bestMove = this.minimax(this.gameModel.board, this.maxDepth, -Infinity, Infinity, true);
        return bestMove.move;
    }

    minimax(board, depth, alpha, beta, isMaximizing) {
        if (depth === 0 || this.isGameOver(board)) {
            const score = this.evaluateBoard(board);
            return { score };
        }

        const availableMoves = this.getAvailableMoves(board);
        let bestMove;

        if (isMaximizing) {
            let maxEval = -Infinity;
            for (const move of availableMoves) {
                const newBoard = this.makeTemporaryMove(board, move, 'black');
                if (this.checkWin(newBoard, 'black')) {
                    return { move, score: Infinity };
                }
                const result = this.minimax(newBoard, depth - 1, alpha, beta, false);
                if (result.score > maxEval) {
                    maxEval = result.score;
                    bestMove = move;
                }
                alpha = Math.max(alpha, maxEval);
                if (beta <= alpha) {
                    break; // Beta 剪枝
                }
            }
            return { move: bestMove, score: maxEval };
        } else {
            let minEval = Infinity;
            for (const move of availableMoves) {
                const newBoard = this.makeTemporaryMove(board, move, 'white');
                if (this.checkWin(newBoard, 'white')) {
                    return { move, score: -Infinity };
                }
                const result = this.minimax(newBoard, depth - 1, alpha, beta, true);
                if (result.score < minEval) {
                    minEval = result.score;
                    bestMove = move;
                }
                beta = Math.min(beta, minEval);
                if (beta <= alpha) {
                    break; // Alpha 剪枝
                }
            }
            return { move: bestMove, score: minEval };
        }
    }

    makeTemporaryMove(board, move, player) {
        const newBoard = board.map(row => [...row]);
        newBoard[move.row][move.col] = player;
        return newBoard;
    }

    getAvailableMoves(board) {
        const moves = new Set();
        const threatMoves = [];
        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1], /*[0,0],*/[0, 1],
            [1, -1], [1, 0], [1, 1],
        ];

        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if (board[i][j] !== null) {
                    for (const [dx, dy] of directions) {
                        const x = i + dx;
                        const y = j + dy;
                        if (
                            x >= 0 &&
                            x < board.length &&
                            y >= 0 &&
                            y < board[0].length &&
                            board[x][y] === null
                        ) {
                            const pos = `${x},${y}`;
                            if (!moves.has(pos)) {
                                moves.add(pos);

                                // 检查此位置是否能阻挡对手的威胁
                                const tempBoard = this.makeTemporaryMove(board, { row: x, col: y }, 'black');
                                if (this.hasOpponentThreat(tempBoard, 'white')) {
                                    threatMoves.push({ row: x, col: y });
                                }
                            }
                        }
                    }
                }
            }
        }

        // 如果有威胁的走法，优先考虑
        if (threatMoves.length > 0) {
            return threatMoves;
        }

        // 如果没有威胁的走法，返回所有可能的走法
        return Array.from(moves).map((pos) => {
            const [row, col] = pos.split(',').map(Number);
            return { row, col };
        });
    }

    hasOpponentThreat(board, opponent) {
        const lines = this.getAllLines(board);
        const threatPattern = new RegExp(`\\.${opponent}${opponent}${opponent}\\.`, 'g');
        for (const line of lines) {
            const lineStr = line.map(cell => {
                if (cell === 'black') return 'b';
                else if (cell === 'white') return 'w';
                else return '.';
            }).join('');
            if (threatPattern.test(lineStr)) {
                return true;
            }
        }
        return false;
    }

    isGameOver(board) {
        return this.checkWin(board, 'black') || this.checkWin(board, 'white') || this.isBoardFull(board);
    }

    isBoardFull(board) {
        return board.every(row => row.every(cell => cell !== null));
    }

    checkWin(board, player) {
        const lines = this.getAllLines(board);
        const winPattern = new RegExp(`${player}{5}`);
        for (const line of lines) {
            if (winPattern.test(line.join(''))) {
                return true;
            }
        }
        return false;
    }

    getAllLines(board) {
        const lines = [];
        const size = board.length;

        // 水平线
        for (let i = 0; i < size; i++) {
            lines.push(board[i]);
        }

        // 垂直线
        for (let j = 0; j < size; j++) {
            const col = [];
            for (let i = 0; i < size; i++) {
                col.push(board[i][j]);
            }
            lines.push(col);
        }

        // 对角线
        for (let k = -size + 1; k < size; k++) {
            const diag1 = [];
            const diag2 = [];
            for (let i = 0; i < size; i++) {
                const j1 = i + k;
                const j2 = size - 1 - i - k;
                if (j1 >= 0 && j1 < size) {
                    diag1.push(board[i][j1]);
                }
                if (j2 >= 0 && j2 < size) {
                    diag2.push(board[i][j2]);
                }
            }
            if (diag1.length > 0) lines.push(diag1);
            if (diag2.length > 0) lines.push(diag2);
        }

        return lines;
    }

    evaluateBoard(board) {
        let score = 0;
        const patterns = [
            // 自己的得分模式
            { pattern: 'bbbbb', score: 100000 }, // 连五
            { pattern: 'bbbb', score: 10000 }, // 活四或冲四
            { pattern: 'bbb', score: 1000 }, // 活三
            { pattern: 'bb', score: 100 }, // 活二

            // 对手的得分模式（需要阻挡）
            { pattern: 'wwwww', score: -100000 }, // 对手的连五
            { pattern: 'wwww', score: -10000 }, // 对手的活四或冲四
            { pattern: 'www', score: -1000 }, // 对手的活三
            { pattern: 'ww', score: -100 }, // 对手的活二
        ];

        const lines = this.getAllLines(board);

        for (const line of lines) {
            const lineStr = line.map(cell => {
                if (cell === 'black') return 'b';
                else if (cell === 'white') return 'w';
                else return '.';
            }).join('');

            for (const { pattern, score: patternScore } of patterns) {
                let index = lineStr.indexOf(pattern);
                while (index !== -1) {
                    score += patternScore;
                    index = lineStr.indexOf(pattern, index + 1);
                }
            }
        }

        return score;
    }
}