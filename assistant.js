document.addEventListener("DOMContentLoaded", () => {
    const assistant = document.getElementById("assistant");
    const assistantImage = document.getElementById("assistant-image");
    let moveSpeed = 20;

    document.addEventListener("keydown", (event) => {
        let rect = assistant.getBoundingClientRect();
        let windowWidth = window.innerWidth;
        let windowHeight = window.innerHeight;

        switch (event.key) {
            case "ArrowUp":
                if (rect.top > 0) {
                    assistant.style.top = rect.top - moveSpeed + "px";
                    assistantImage.src = "image/Sprut_Move.gif";
                    assistant.style.transform = "scaleX(1)";
                }
                break;
            case "ArrowDown":
                if (rect.bottom < windowHeight) {
                    assistant.style.top = rect.top + moveSpeed + "px";
                    assistantImage.src = "image/Sprut_Move.gif";
                    assistant.style.transform = "scaleX(-1)";
                }
                break;
            case "ArrowLeft":
                if (rect.left > 0) {
                    assistant.style.left = rect.left - moveSpeed + "px";
                    assistantImage.src = "image/Sprut_Move.gif";
                    assistant.style.transform = "scaleX(1)";
                }
                break;
            case "ArrowRight":
                if (rect.right < windowWidth) {
                    assistant.style.left = rect.left + moveSpeed + "px";
                    assistantImage.src = "image/Sprut_Move.gif";
                    assistant.style.transform = "scaleX(-1)";
                }
                break;
        }

        setTimeout(() => {
            assistantImage.src = "image/Sprut_Idle.gif";
        }, 500);
    });
});
