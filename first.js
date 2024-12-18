const ball = document.getElementById('ball');
const star = document.getElementById('star');
const container = document.getElementById('container');
const scoreboard = document.getElementById('scoreboard');

const upButton = document.getElementById('upButton');
const leftButton = document.getElementById('leftButton');
const rightButton = document.getElementById('rightButton');
const downButton = document.getElementById('downButton');

let score = 0;
let starSpeedMultiplier = 1.0;
let intervalId = null;

const containerWidth = container.clientWidth;
const containerHeight = container.clientHeight;
const ballDiameter = ball.offsetWidth;
const starDiameter = star.offsetWidth;

let gravity = 1; // Gravity force
let ballSpeed = parseInt(localStorage.getItem('ballSpeed')) || 2;
let borderGameOverEnabled = localStorage.getItem('borderGameOver') === 'true';

// Initial positions
let ballX = containerWidth / 2 - ballDiameter / 2;
let ballY = containerHeight / 2 - ballDiameter / 2;

let starX = Math.random() * (containerWidth - starDiameter);
let starY = Math.random() * (containerHeight - starDiameter);
let starXSpeed = (Math.random() - 0.5) * 4 * starSpeedMultiplier;
let starYSpeed = (Math.random() - 0.5) * 4 * starSpeedMultiplier;

// Move ball in the specified direction
function moveBall(direction) {
    switch (direction) {
        case 'Up':
            ballY -= ballSpeed;
            ballY = Math.max(0, ballY);
            break;
        case 'Right':
            ballX += ballSpeed;
            ballX = Math.min(containerWidth - ballDiameter, ballX);
            break;
        case 'Down':
            ballY += ballSpeed;
            ballY = Math.min(containerHeight - ballDiameter, ballY);
            break;
        case 'Left':
            ballX -= ballSpeed;
            ballX = Math.max(0, ballX);
            break;
    }
    updateBallPosition();
}

// Apply gravity to the ball
function applyGravity() {
    ballY += gravity;

    // Check if the ball touches the floor
    if (ballY >= containerHeight - ballDiameter) {
        if (borderGameOverEnabled) {
            gameOver();
            return;
        }
        ballY = containerHeight - ballDiameter; // Stop at the bottom
    }

    updateBallPosition();
}

// Update ball position
function updateBallPosition() {
    ball.style.left = `${ballX}px`;
    ball.style.top = `${ballY}px`;
}

// Start moving the ball
function startMoving(direction) {
    stopMoving(); // Ensure no previous movement continues
    intervalId = setInterval(() => moveBall(direction), 10); // Moves every 10ms
}

// Stop moving the ball
function stopMoving() {
    clearInterval(intervalId);
    intervalId = null;
}

// Add event listeners for buttons (Mouse and Touch)
function addControlListeners(button, direction) {
    button.addEventListener('mousedown', () => startMoving(direction));
    button.addEventListener('mouseup', stopMoving);
    button.addEventListener('mouseleave', stopMoving);

    button.addEventListener('touchstart', (e) => {
        e.preventDefault(); // Prevent default touch behavior
        startMoving(direction);
    });
    button.addEventListener('touchend', (e) => {
        e.preventDefault();
        stopMoving();
    });
}

addControlListeners(upButton, 'Up');
addControlListeners(rightButton, 'Right');
addControlListeners(downButton, 'Down');
addControlListeners(leftButton, 'Left');


// Check collision
function isColliding(x1, y1, r1, x2, y2, r2) {
    const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    return distance < r1 + r2;
}

// End the game
function gameOver() {
    localStorage.setItem('finalScore', score);
    window.location.href = 'gameover.html';
}

// Animation loop
function animate() {
    // Apply gravity
    applyGravity();

    // Move the star
    starX += starXSpeed;
    starY += starYSpeed;

    // Star collision with walls
    if (starX <= 0 || starX >= containerWidth - starDiameter) {
        starXSpeed *= -1;
    }
    if (starY <= 0 || starY >= containerHeight - starDiameter) {
        starYSpeed *= -1;
    }

    // Check for collision between ball and star
    if (isColliding(ballX + ballDiameter / 2, ballY + ballDiameter / 2, ballDiameter / 2,
                    starX + starDiameter / 2, starY + starDiameter / 2, starDiameter / 2)) {
        gameOver();
        return;
    }

    // Update score
    score++;
    scoreboard.textContent = `Score: ${score}`;

    // Increase star speed every 100 points
    if (score % 100 === 0) {
        starSpeedMultiplier += 0.2;
        starXSpeed *= starSpeedMultiplier;
        starYSpeed *= starSpeedMultiplier;
    }



    

    // Update positions of elements
    star.style.left = `${starX}px`;
    star.style.top = `${starY}px`;



    
    requestAnimationFrame(animate);
}




animate();
