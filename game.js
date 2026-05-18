// Global player state
let currentPlayer = '';

// === LOGIN SYSTEM ===
function startGame() {
    const nameInput = document.getElementById('playerName');
    currentPlayer = nameInput.value.trim();
    
    if (!currentPlayer) {
        alert('Please enter your name!');
        return;
    }
    
    document.getElementById('loginSection').classList.add('hidden');
    document.getElementById('gameSelection').classList.remove('hidden');
    document.getElementById('currentPlayer').textContent = `👤 Playing as: ${currentPlayer}`;
}

function playGame(gameName) {
    document.getElementById('gameSelection').classList.add('hidden');
    document.getElementById(gameName).classList.remove('hidden');
    
    // Initialize the game
    if (gameName === 'tictactoe') {
        resetTicTacToe();
    } else if (gameName === 'memoryMatch') {
        resetMemory();
    } else if (gameName === 'rockPaperScissors') {
        document.getElementById('rpsPlayer').textContent = currentPlayer;
        resetRPS();
    } else if (gameName === 'numberGuesser') {
        document.getElementById('numPlayer').textContent = currentPlayer;
        resetNumberGuesser();
    }
}

function backToGames() {
    document.querySelectorAll('.game-section').forEach(section => {
        section.classList.add('hidden');
    });
    document.getElementById('gameSelection').classList.remove('hidden');
}

// === TIC TAC TOE GAME ===
let tttBoard = ['', '', '', '', '', '', '', '', ''];
let tttCurrentPlayer = 'X';
let tttGameOver = false;

function resetTicTacToe() {
    tttBoard = ['', '', '', '', '', '', '', '', ''];
    tttCurrentPlayer = 'X';
    tttGameOver = false;
    updateTTTDisplay();
}

function tttMove(index) {
    if (tttBoard[index] !== '' || tttGameOver) return;
    
    tttBoard[index] = tttCurrentPlayer;
    
    const winner = checkTTTWinner();
    if (winner) {
        document.getElementById('tttStatus').textContent = `🎉 ${winner} wins!`;
        tttGameOver = true;
    } else if (tttBoard.every(cell => cell !== '')) {
        document.getElementById('tttStatus').textContent = "It's a draw!";
        tttGameOver = true;
    } else {
        tttCurrentPlayer = tttCurrentPlayer === 'X' ? 'O' : 'X';
        updateTTTDisplay();
    }
    
    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell, i) => {
        cell.textContent = tttBoard[i];
    });
}

function updateTTTDisplay() {
    const statusEl = document.getElementById('tttStatus');
    statusEl.textContent = '';
    const playerDisplay = tttCurrentPlayer === 'X' ? `${currentPlayer} (X)` : `Opponent (O)`;
    document.getElementById('tttPlayer').innerHTML = `Player 1 (X): <strong>${currentPlayer}</strong>`;
}

function checkTTTWinner() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    
    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (tttBoard[a] && tttBoard[a] === tttBoard[b] && tttBoard[a] === tttBoard[c]) {
            return tttBoard[a];
        }
    }
    return null;
}

// === MEMORY MATCH GAME ===
let memoryCards = [];
let memoryFlipped = [];
let memoryMatched = [];
let memoryScore = 0;

const memorySymbols = ['🎮', '🎮', '🎨', '🎨', '🎭', '🎭', '🎪', '🎪', 
                       '🎸', '🎸', '🎲', '🎲', '🏆', '🏆', '🎯', '🎯'];

function resetMemory() {
    memoryCards = [...memorySymbols].sort(() => Math.random() - 0.5);
    memoryFlipped = [];
    memoryMatched = [];
    memoryScore = 0;
    document.getElementById('memoryPlayer').textContent = currentPlayer;
    document.getElementById('memoryScore').textContent = '0';
    renderMemoryGrid();
}

function renderMemoryGrid() {
    const grid = document.getElementById('memoryGrid');
    grid.innerHTML = '';
    
    memoryCards.forEach((symbol, index) => {
        const card = document.createElement('button');
        card.className = 'memory-card';
        
        if (memoryMatched.includes(index)) {
            card.classList.add('matched');
            card.textContent = symbol;
        } else if (memoryFlipped.includes(index)) {
            card.classList.add('flipped');
            card.textContent = symbol;
        }
        
        card.onclick = () => flipMemoryCard(index);
        grid.appendChild(card);
    });
}

function flipMemoryCard(index) {
    if (memoryFlipped.includes(index) || memoryMatched.includes(index) || memoryFlipped.length === 2) {
        return;
    }
    
    memoryFlipped.push(index);
    renderMemoryGrid();
    
    if (memoryFlipped.length === 2) {
        checkMemoryMatch();
    }
}

function checkMemoryMatch() {
    const [first, second] = memoryFlipped;
    
    if (memoryCards[first] === memoryCards[second]) {
        memoryMatched.push(first, second);
        memoryScore++;
        document.getElementById('memoryScore').textContent = memoryScore;
        memoryFlipped = [];
        
        if (memoryMatched.length === memoryCards.length) {
            setTimeout(() => alert(`🎉 You won! Score: ${memoryScore}`), 500);
        }
        
        renderMemoryGrid();
    } else {
        setTimeout(() => {
            memoryFlipped = [];
            renderMemoryGrid();
        }, 1000);
    }
}

// === ROCK PAPER SCISSORS GAME ===
let rpsPlayerScore = 0;
let rpsComputerScore = 0;

function resetRPS() {
    rpsPlayerScore = 0;
    rpsComputerScore = 0;
    document.getElementById('playerScore').textContent = '0';
    document.getElementById('computerScore').textContent = '0';
    document.getElementById('rpsResult').textContent = '';
    document.getElementById('rpsResult').className = '';
}

function playRPS(playerChoice) {
    const choices = ['rock', 'paper', 'scissors'];
    const computerChoice = choices[Math.floor(Math.random() * 3)];
    const result = determineRPSWinner(playerChoice, computerChoice);
    
    const resultEl = document.getElementById('rpsResult');
    const choiceEmojis = { rock: '🪨', paper: '📄', scissors: '✂️' };
    
    let resultText = `You: ${choiceEmojis[playerChoice]}<br>Computer: ${choiceEmojis[computerChoice]}<br>`;
    
    if (result === 'win') {
        rpsPlayerScore++;
        resultText += 'You won this round!';
        resultEl.className = 'win';
    } else if (result === 'lose') {
        rpsComputerScore++;
        resultText += 'Computer won this round!';
        resultEl.className = 'lose';
    } else {
        resultText += 'It\'s a draw!';
        resultEl.className = 'draw';
    }
    
    resultEl.innerHTML = resultText;
    document.getElementById('playerScore').textContent = rpsPlayerScore;
    document.getElementById('computerScore').textContent = rpsComputerScore;
}

function determineRPSWinner(player, computer) {
    if (player === computer) return 'draw';
    if (
        (player === 'rock' && computer === 'scissors') ||
        (player === 'paper' && computer === 'rock') ||
        (player === 'scissors' && computer === 'paper')
    ) {
        return 'win';
    }
    return 'lose';
}

// === NUMBER GUESSER GAME ===
let secretNumber = 0;
let attempts = 0;

function resetNumberGuesser() {
    secretNumber = Math.floor(Math.random() * 100) + 1;
    attempts = 0;
    document.getElementById('guessInput').value = '';
    document.getElementById('guessResult').textContent = '';
    document.getElementById('guessResult').className = '';
    document.getElementById('attempts').textContent = '0';
}

function submitGuess() {
    const input = document.getElementById('guessInput');
    const guess = parseInt(input.value);
    
    if (isNaN(guess) || guess < 1 || guess > 100) {
        alert('Please enter a number between 1 and 100');
        return;
    }
    
    attempts++;
    document.getElementById('attempts').textContent = attempts;
    const resultEl = document.getElementById('guessResult');
    
    if (guess === secretNumber) {
        resultEl.textContent = `🎉 You got it! The number was ${secretNumber}! (${attempts} attempts)`;
        resultEl.className = 'correct';
        input.disabled = true;
    } else if (guess < secretNumber) {
        resultEl.textContent = `📈 Too low! Try a higher number.`;
        resultEl.className = 'toolow';
    } else {
        resultEl.textContent = `📉 Too high! Try a lower number.`;
        resultEl.className = 'toohigh';
    }
    
    input.value = '';
}

// Allow Enter key to submit guess
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('guessInput')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') submitGuess();
    });
});
