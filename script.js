document.addEventListener("DOMContentLoaded", function () {
    const octopus = document.getElementById("octopus");
    const toggleBtn = document.getElementById("toggleAssistant");
    const factBtn = document.getElementById("showFact");
    const danceBtn = document.getElementById("dance");
    const factBox = document.getElementById("factBox");

    let isVisible = true;
    let position = { x: 50, y: 50 };
    let direction = 1; // 1 = up/left, -1 = down/right

    // Toggle Assistant Visibility
    toggleBtn.addEventListener("click", function () {
        if (isVisible) {
            octopus.style.display = "none";
        } else {
            octopus.style.display = "block";
        }
        isVisible = !isVisible;
    });

    // Show Floating Fact Box
    factBtn.addEventListener("click", function () {
        factBox.style.display = "block";
        setTimeout(() => {
            factBox.style.display = "none";
        }, 4000);
    });

    // Dance Mode
    danceBtn.addEventListener("click", function () {
        octopus.src = "image/Sprut_dance.gif";
        setTimeout(() => {
            octopus.src = "image/Sprut_Idle.gif";
        }, 3000);
    });

    // Move Assistant
    function moveOctopus() {
        if (direction === 1) {
            octopus.src = "image/Sprut_move.gif";
            position.x -= 20;
            position.y -= 20;
        } else {
            octopus.src = "image/Sprut_move.gif";
            position.x += 20;
            position.y += 20;
        }

        if (position.x < 50 || position.y < 50) {
            direction = -1;
        } else if (position.x > window.innerWidth - 150 || position.y > window.innerHeight - 150) {
            direction = 1;
        }

        octopus.style.transform = `translate(${position.x}px, ${position.y}px)`;

        setTimeout(() => {
            octopus.src = "image/Sprut_Idle.gif";
        }, 500);
    }

    octopus.addEventListener("click", moveOctopus);
});
