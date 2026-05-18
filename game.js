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
    } else if (gameName === 'basketball') {
        document.getElementById('basketballPlayer').textContent = currentPlayer;
        resetBasketball();
    }
}

function backToGames() {
    document.querySelectorAll('.game-section').forEach(section => {
        section.classList.add('hidden');
    });
    document.getElementById('gameSelection').classList.remove('hidden');
    stopBasketballGame();
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

// === BASKETBALL SHOOTING GAME ===
let basketballCanvas;
let basketballCtx;
let basketballScore = 0;
let basketballTime = 30;
let basketballGameActive = false;
let basketballGameRunning = false;

// Player ball position and velocity
let ballX = 400;
let ballY = 500;
let ballVelX = 0;
let ballVelY = 0;
let ballRadius = 12;

// Angle and power for aiming
let shootAngle = 45; // degrees
let shootPower = 50; // 0-100

// Hoop position
const hoopX = 550;
const hoopY = 150;
const rimRadius = 20;

// Keys pressed
const keysPressed = {};

function resetBasketball() {
    basketballCanvas = document.getElementById('basketballCanvas');
    basketballCtx = basketballCanvas.getContext('2d');
    
    basketballScore = 0;
    basketballTime = 30;
    basketballGameActive = true;
    basketballGameRunning = true;
    ballX = 400;
    ballY = 500;
    ballVelX = 0;
    ballVelY = 0;
    shootAngle = 45;
    shootPower = 50;
    
    document.getElementById('basketballScore').textContent = '0';
    document.getElementById('basketballTimer').textContent = '30';
    document.getElementById('basketballStatus').textContent = 'Use WASD or ARROW KEYS to aim and shoot!';
    
    // Set up key listeners
    document.addEventListener('keydown', handleBasketballKeyDown);
    document.addEventListener('keyup', handleBasketballKeyUp);
    
    // Start game loop
    startBasketballGameLoop();
}

function handleBasketballKeyDown(e) {
    keysPressed[e.key.toLowerCase()] = true;
    
    // Spacebar or Enter to shoot
    if ((e.key === ' ' || e.key === 'Enter') && basketballGameActive) {
        shootBasketball();
        e.preventDefault();
    }
}

function handleBasketballKeyUp(e) {
    keysPressed[e.key.toLowerCase()] = false;
}

function shootBasketball() {
    if (!basketballGameActive) return;
    
    // Convert angle to radians
    const radians = (shootAngle * Math.PI) / 180;
    const speed = (shootPower / 100) * 15;
    
    // Calculate velocity
    ballVelX = Math.cos(radians) * speed;
    ballVelY = -Math.sin(radians) * speed; // Negative because Y increases downward
    
    basketballGameActive = false;
    
    // Re-enable after ball settles
    setTimeout(() => {
        ballX = 400;
        ballY = 500;
        ballVelX = 0;
        ballVelY = 0;
        basketballGameActive = true;
        shootAngle = 45;
        shootPower = 50;
    }, 3000);
}

function startBasketballGameLoop() {
    basketballGameRunning = true;
    updateBasketballGame();
}

function stopBasketballGame() {
    basketballGameRunning = false;
    document.removeEventListener('keydown', handleBasketballKeyDown);
    document.removeEventListener('keyup', handleBasketballKeyUp);
}

function updateBasketballGame() {
    if (!basketballGameRunning) return;
    
    // Update aiming
    if (basketballGameActive) {
        if (keysPressed['w'] || keysPressed['arrowup']) {
            shootAngle = Math.min(shootAngle + 2, 90);
        }
        if (keysPressed['s'] || keysPressed['arrowdown']) {
            shootAngle = Math.max(shootAngle - 2, 10);
        }
        if (keysPressed['a'] || keysPressed['arrowleft']) {
            shootPower = Math.max(shootPower - 2, 20);
        }
        if (keysPressed['d'] || keysPressed['arrowright']) {
            shootPower = Math.min(shootPower + 2, 100);
        }
    } else {
        // Ball physics during flight
        ballVelY += 0.5; // Gravity
        ballX += ballVelX;
        ballY += ballVelY;
        
        // Ball friction/air resistance
        ballVelX *= 0.99;
        ballVelY *= 0.99;
        
        // Check if ball went in the hoop
        const distToHoop = Math.sqrt((ballX - hoopX) ** 2 + (ballY - hoopY) ** 2);
        if (distToHoop < rimRadius + ballRadius && ballY < hoopY + 30) {
            basketballScore++;
            document.getElementById('basketballScore').textContent = basketballScore;
            document.getElementById('basketballStatus').textContent = '🎯 SWISH! Nice shot!';
            
            // Reset for next shot
            setTimeout(() => {
                ballX = 400;
                ballY = 500;
                ballVelX = 0;
                ballVelY = 0;
                basketballGameActive = true;
                shootAngle = 45;
                shootPower = 50;
                document.getElementById('basketballStatus').textContent = 'Use WASD or ARROW KEYS to aim and shoot!';
            }, 1500);
        }
        
        // Ball out of bounds - reset
        if (ballY > 600 || ballX < 0 || ballX > 800) {
            ballX = 400;
            ballY = 500;
            ballVelX = 0;
            ballVelY = 0;
            basketballGameActive = true;
            shootAngle = 45;
            shootPower = 50;
            document.getElementById('basketballStatus').textContent = 'Use WASD or ARROW KEYS to aim and shoot!';
        }
    }
    
    // Draw the game
    drawBasketballGame();
    
    requestAnimationFrame(updateBasketballGame);
}

function drawBasketballGame() {
    // Clear canvas
    basketballCtx.fillStyle = '#2a5f2a';
    basketballCtx.fillRect(0, 0, basketballCanvas.width, basketballCanvas.height);
    
    // Draw court lines
    basketballCtx.strokeStyle = '#ffffff';
    basketballCtx.lineWidth = 2;
    basketballCtx.strokeRect(10, 10, 780, 580);
    basketballCtx.beginPath();
    basketballCtx.arc(400, 300, 60, 0, Math.PI * 2);
    basketballCtx.stroke();
    
    // Draw backboard
    basketballCtx.fillStyle = '#1a1a1a';
    basketballCtx.fillRect(520, 80, 60, 80);
    basketballCtx.strokeStyle = '#ffaa00';
    basketballCtx.lineWidth = 2;
    basketballCtx.strokeRect(520, 80, 60, 80);
    
    // Draw rim
    basketballCtx.strokeStyle = '#ff6600';
    basketballCtx.lineWidth = 3;
    basketballCtx.beginPath();
    basketballCtx.arc(hoopX, hoopY, rimRadius, 0, Math.PI * 2);
    basketballCtx.stroke();
    
    // Draw net
    basketballCtx.strokeStyle = '#cccccc';
    basketballCtx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
        basketballCtx.beginPath();
        basketballCtx.moveTo(hoopX - rimRadius + (i * 10), hoopY);
        basketballCtx.lineTo(hoopX - rimRadius + (i * 7), hoopY + 40);
        basketballCtx.stroke();
    }
    
    // Draw ball
    basketballCtx.fillStyle = '#ff6600';
    basketballCtx.beginPath();
    basketballCtx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    basketballCtx.fill();
    
    // Draw ball lines
    basketballCtx.strokeStyle = '#000000';
    basketballCtx.lineWidth = 1;
    basketballCtx.beginPath();
    basketballCtx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    basketballCtx.stroke();
    
    // Draw aim line when aiming
    if (basketballGameActive) {
        const radians = (shootAngle * Math.PI) / 180;
        const lineLength = shootPower * 1.5;
        const endX = ballX + Math.cos(radians) * lineLength;
        const endY = ballY - Math.sin(radians) * lineLength;
        
        basketballCtx.strokeStyle = '#ffff00';
        basketballCtx.lineWidth = 2;
        basketballCtx.setLineDash([5, 5]);
        basketballCtx.beginPath();
        basketballCtx.moveTo(ballX, ballY);
        basketballCtx.lineTo(endX, endY);
        basketballCtx.stroke();
        basketballCtx.setLineDash([]);
        
        // Draw power bar
        basketballCtx.fillStyle = '#ffff00';
        basketballCtx.fillRect(20, 530, (shootPower / 100) * 200, 20);
        basketballCtx.strokeStyle = '#ffffff';
        basketballCtx.lineWidth = 2;
        basketballCtx.strokeRect(20, 530, 200, 20);
        basketballCtx.fillStyle = '#ffffff';
        basketballCtx.font = '12px Arial';
        basketballCtx.fillText('Power', 20, 550);
        
        // Draw angle display
        basketballCtx.fillStyle = '#ffffff';
        basketballCtx.font = '14px Arial';
        basketballCtx.fillText(`Angle: ${shootAngle}°`, 250, 550);
    }
    
    // Draw instructions
    basketballCtx.fillStyle = '#ffffff';
    basketballCtx.font = '12px Arial';
    basketballCtx.fillText('W/↑: Angle Up  |  S/↓: Angle Down  |  A/←: Power Down  |  D/→: Power Up  |  SPACE/ENTER: Shoot', 10, basketballCanvas.height - 10);
}

// Timer for basketball game
setInterval(() => {
    if (basketballGameRunning && basketballTime > 0) {
        basketballTime--;
        document.getElementById('basketballTimer').textContent = basketballTime;
        
        if (basketballTime === 0) {
            stopBasketballGame();
            basketballGameRunning = false;
            document.getElementById('basketballStatus').textContent = `⏰ Time's up! Final Score: ${basketballScore}`;
        }
    }
}, 1000);

// Allow Enter key to submit guess
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('guessInput')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') submitGuess();
    });
});
