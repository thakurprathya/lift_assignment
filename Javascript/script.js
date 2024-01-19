const elevator = document.querySelector(".lift");
const screenLevel = document.querySelectorAll(".screen > p")?.[0];
const screenText = document.querySelectorAll(".screen > p")?.[1];
const upButton = document.querySelectorAll(".buttons > button")?.[0];
const downButton = document.querySelectorAll(".buttons > button")?.[1];
let currentLevel = 0;
let liftIsMoving = false;
let movingDirection = "up";

// intialization
window.scrollTo(0, document.body.scrollHeight);
downButton.style.display = "none";
screenLevel.innerHTML = "Level 0";

function updateScreen() {
    if (currentLevel === 0) {
        downButton.style.display = "none";
        screenLevel.innerHTML = "Level 0";
    }
    if (currentLevel === 1) {
        upButton.style.display = "flex";
        downButton.style.display = "flex";
        screenLevel.innerHTML = "Level 1";
    }
    if (currentLevel === 2) {
        upButton.style.display = "none";
        screenLevel.innerHTML = "Level 2";
    }

    if(liftIsMoving && movingDirection === "up"){
        screenLevel.innerHTML = "Level "+(currentLevel+1);
        screenText.innerHTML = "⬆";
    }
    else if(liftIsMoving && movingDirection === "down"){
        screenLevel.innerHTML = "Level "+(currentLevel-1);
        screenText.innerHTML = "⬇";
    }
    else{
        screenText.innerHTML = "";
    }
}

function moveLift(targetLevel, direction) {
    liftIsMoving = true;
    movingDirection = direction;
    updateScreen();

    const translationDistance = (targetLevel - currentLevel) * window.innerHeight;
    const scrollDuration = 5000; // 5 seconds
    const startScrollPosition = window.scrollY;
    const startTime = performance.now();

    function scrollToTarget(timestamp, direction) {
        const elapsed = timestamp - startTime;
        const progress = elapsed / scrollDuration;

        if(direction === "up") window.scrollTo(0, startScrollPosition + progress * translationDistance);
        else window.scrollTo(0, startScrollPosition - progress * translationDistance);

        if (progress < 1) {
            requestAnimationFrame(scrollToTarget);
        } else {
            liftIsMoving = false;
            currentLevel = targetLevel;
        }
    }
    requestAnimationFrame(scrollToTarget);

    liftIsMoving = false;
    setTimeout(updateScreen,5000);
}

function moveUp(){
    if (currentLevel < 2) {
        upButton.disabled = true;
        downButton.disabled = true;
        moveLift(currentLevel + 1, "up");
        setTimeout(() => {
            upButton.disabled = false;
            downButton.disabled = false;
        }, 5000);
    }
}
function moveDown(){
    if (currentLevel > 0) {
        upButton.disabled = true;
        downButton.disabled = true;
        moveLift(currentLevel - 1, "down");
        setTimeout(() => {
            upButton.disabled = false;
            downButton.disabled = false;
        }, 5000);
    }
}
function handleKeyDown(event) {
    if ((event.key === "w" || event.key === "ArrowUp") && currentLevel < 2 && !upButton.disabled) { moveUp(); } 
    else if ((event.key === "s" || event.key === "ArrowDown") && currentLevel > 0 && !downButton.disabled) { moveDown(); }
}


// handling events
upButton.addEventListener("click", moveUp);
downButton.addEventListener("click", moveDown);
document.addEventListener("keydown", handleKeyDown);