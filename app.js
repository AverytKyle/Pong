const paddle_1 = document.querySelector(".paddle-left");
const paddle_2 = document.querySelector(".paddle-right");
const ball = document.querySelector(".ball");
const score_1 = document.querySelector(".score-left");
const score_2 = document.querySelector(".score-right");
const message = document.querySelector(".game-message");
let paddle_1_coord = paddle_1.getBoundingClientRect();
let paddle_2_coord = paddle_2.getBoundingClientRect();
let ball_coord = ball.getBoundingClientRect();
const board_coord = document.querySelector(".game-container").getBoundingClientRect();
const paddle_hit_box = document.querySelector(".paddle").getBoundingClientRect();
const start_button = document.querySelector(".game-button");

let x = ball_coord.left;
let y = ball_coord.top;
let dx = Math.random() > 0.5 ? 3 : -3;
let dy = Math.random() > 0.5 ? 3 : -3;

let paddle2Y = 250;

// Set the paddle position
paddle_2.style.marginTop = '250px';

document.addEventListener('mousemove', (e) => {
    // Get mouse Y position relative to the viewport
    const mouseY = e.clientY;
    
    // Calculate paddle position (center paddle on mouse)
    const paddleHeight = paddle_1.getBoundingClientRect().height;
    let paddleY = mouseY - (paddleHeight / 2);
    
    // Keep paddle within game boundaries
    const minY = board_coord.top;
    const maxY = board_coord.bottom - paddleHeight;
    
    // Clamp paddle position to stay within bounds
    if (paddleY < minY) {
        paddleY = minY;
    } else if (paddleY > maxY) {
        paddleY = maxY;
    }
    
    // Since paddle is position: fixed, set top directly (not margin-top)
    paddle_1.style.top = paddleY + 'px';
    paddle_1.style.marginTop = '0px'; // Reset margin-top since we're using top
    
    // Update paddle coordinates for collision detecti
});

const moveBall = () => {
    // Update the ball's position
    x += dx;
    y += dy;

    // Update the ball's position on the screen
    ball.style.left = x + "px";
    ball.style.top = y + "px";

    ball_coord = ball.getBoundingClientRect();

    //Bounce off top and bottom walls
    if (y <= board_coord.top || y >= board_coord.bottom - ball_coord.height) {
        dy = -dy;
    }

    //Check for scoring
    if (x <= board_coord.left) {
        // Player 2 scores
        score_2.textContent = parseInt(score_2.textContent) + 1;
        resetBall();
    } else if (x >= board_coord.right - ball_coord.width) {
        // Player 1 scores
        score_1.textContent = parseInt(score_1.textContent) + 1;
        resetBall();
    }

    // Check for collisions with the paddles
    checkPaddleCollision();

}

const checkPaddleCollision = () => {
    paddle_1_coord = paddle_1.getBoundingClientRect();
    paddle_2_coord = paddle_2.getBoundingClientRect();

    // Check for collision with paddle 1
    if (x <= paddle_1_coord.right && y >= paddle_1_coord.top && y <= paddle_1_coord.bottom) {
        dx = -dx;
    }

    // Check for collision with paddle 2
    if (ball_coord.right >= paddle_2_coord.left && y >= paddle_2_coord.top && y <= paddle_2_coord.bottom) {
        dx = -dx;
    }
}

const paddleAI = () => {
    // Get the coordinates of the ball
    const ballY = ball.getBoundingClientRect().top;
    const ballHeight = ball.getBoundingClientRect().height;
    const ballCenter = ballY + ballHeight / 2;
    const currentPaddleY = paddle_2_coord.top;
    const aiSpeed = 2.5;
    
    // Get paddle info
    const paddleHeight = paddle_2_coord.height;
    
    // Calculate where we want the paddle center to be (following the ball)
    let targetPaddleY = ballCenter - paddleHeight / 2;
    
    // Keep paddle within game boundaries
    const minY = board_coord.top;
    const maxY = board_coord.bottom - paddleHeight;

    // Calculate the difference between current and target position
    const difference = targetPaddleY - currentPaddleY;
    
    // Clamp paddle position to stay within bounds
    if (targetPaddleY < minY) {
        targetPaddleY = minY;
    } else if (targetPaddleY > maxY) {
        targetPaddleY = maxY;
    }

    // Move towards target, but limit the speed
    if (Math.abs(difference) > aiSpeed) {
        // Move at limited speed towards the target
        paddle2Y = currentPaddleY + (difference > 0 ? aiSpeed : -aiSpeed);
    } else {
        // If close enough, just set the position directly
        paddle2Y = targetPaddleY;
    }
    
    // Update the paddle's position (since it's position: fixed)
    paddle_2.style.top = paddle2Y + 'px';
    paddle_2.style.marginTop = '0px'; // Reset margin-top
    
    // Update paddle coordinates for collision detection
    paddle_2_coord = paddle_2.getBoundingClientRect();
}



const resetBall = () => {
    x = board_coord.left + board_coord.width / 2;
    y = board_coord.top + board_coord.height / 2;
    
    dx = Math.random() > 0.5 ? 3 : -3;
    dy = Math.random() > 0.5 ? 3 : -3;
}

const gameLoop = () => {
    // Move the ball
    moveBall();
    paddleAI();
    requestAnimationFrame(gameLoop);
}

start_button.addEventListener("click", () => {
    gameLoop();
})