const questions = [
    { question: "Обрання Хмельницького гетьманом", answer: "1648" },
    { question: "Битва під Жовтими Водами, травень якого року", answer: "1648" },
    { question: "Битва під Корсунем, травень якого року", answer: "1648" },
    { question: "Битва під Пилявцями, травень якого року", answer: "1648" },
    { question: "Рік Зборівської битви", answer: "1649" },
    { question: "Рік Зборівської угоди", answer: "1649" },
    { question: "Козацький реєстр за Зборівським договором (тисяч)", answer: "40" },
    { question: "Кількість воєводств під владою Б. Хмельницького за Зборівським договором", answer: "3" },
    { question: "Берестецька битва", answer: "1651" },
    { question: "Білоцерківська угода", answer: "1651" },
    { question: "Битва під Батогом", answer: "1652" },
    { question: "Будівництво Десятинної церкви в Києві", answer: "996" }
];

const gameArea = document.getElementById("gameArea");
const inputElement = document.getElementById("input");
const clearButton = document.getElementById("clearButton");
const answersList = document.getElementById("answersList");
const scoreElement = document.getElementById("score");
const livesElement = document.getElementById("lives");
const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");
const exitButton = document.getElementById("exitButton");

let activeQuestions = [];
let usedQuestions = new Set();
let score = 0;
let lives = 3;
let gameInterval;
let dropInterval;

function startGame() {
    resetGame();
    inputElement.disabled = false;
    inputElement.focus();
    startButton.disabled = true;
    restartButton.disabled = false;

    addQuestion();
    gameInterval = setInterval(addQuestion, 5000);
    dropInterval = setInterval(moveQuestions, 50);
}

function resetGame() {
    activeQuestions.forEach(q => q.element.remove());
    activeQuestions = [];
    usedQuestions.clear();
    score = 0;
    lives = 3;
    scoreElement.textContent = score;
    livesElement.textContent = lives;
    answersList.innerHTML = "";
    clearInterval(gameInterval);
    clearInterval(dropInterval);
    inputElement.value = "";
}

function addQuestion() {
    if (activeQuestions.length >= 5) return;

    if (usedQuestions.size === questions.length) {
        usedQuestions.clear();
    }

    const availableQuestions = questions.filter(q => !usedQuestions.has(q.question));
    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    const questionData = availableQuestions[randomIndex];
    usedQuestions.add(questionData.question);

    const questionElement = document.createElement("div");
    questionElement.classList.add("question");
    questionElement.textContent = questionData.question;

    const startX = Math.random() * (gameArea.offsetWidth - 150);
    questionElement.style.left = `${startX}px`;
    questionElement.style.top = `0px`;

    gameArea.appendChild(questionElement);

    activeQuestions.push({
        question: questionData.question,
        answer: questionData.answer,
        element: questionElement,
        top: 0
    });
}

function moveQuestions() {
    activeQuestions.forEach((q, index) => {
        q.top += 1;
        q.element.style.top = `${q.top}px`;

        if (q.top > gameArea.offsetHeight) {
            addAnswerToBox(q.question, q.answer);
            q.element.remove();
            activeQuestions.splice(index, 1);
            loseLife();
        }
    });
}

function addAnswerToBox(question, answer) {
    const listItem = document.createElement("li");
    listItem.textContent = `${question}: ${answer}`;
    answersList.appendChild(listItem);
}

function loseLife() {
    lives--;
    livesElement.textContent = lives;
    if (lives <= 0) {
        endGame(false);
    }
}

function checkAnswer(input) {
    const matchedQuestionIndex = activeQuestions.findIndex(q => q.answer.toLowerCase() === input.toLowerCase());

    if (matchedQuestionIndex !== -1) {
        const matchedQuestion = activeQuestions[matchedQuestionIndex];
        matchedQuestion.element.remove();
        activeQuestions.splice(matchedQuestionIndex, 1);

        score++;
        scoreElement.textContent = score;
        inputElement.value = "";

        if (score >= 50) {
            endGame(true);
        }
    }
}

function endGame(isWin) {
    clearInterval(gameInterval);
    clearInterval(dropInterval);
    activeQuestions.forEach(q => q.element.remove());
    activeQuestions = [];
    inputElement.disabled = true;

    if (isWin) {
        const winImage = document.createElement("img");
        winImage.src = "New_Makako.jpg";
        winImage.alt = "Вітаємо!";
        winImage.style.maxWidth = "100%";
        winImage.style.maxHeight = "100%";
        winImage.style.objectFit = "contain";
        winImage.style.marginTop = "20px";
        winImage.style.borderRadius = "10px";

        gameArea.innerHTML = "";
        gameArea.appendChild(winImage);

        alert("Вітаємо! Ви виграли!");
    } else {
        alert("Гру завершено!");
    }

    restartButton.disabled = true;
    startButton.disabled = false;
}

startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", () => {
    resetGame();
    startGame();
});
exitButton.addEventListener("click", () => {
    resetGame();
    alert("Ви вийшли з гри. До зустрічі!");
});

document.querySelectorAll('.numButton').forEach(button => {
    button.addEventListener('click', () => {
        const value = button.getAttribute('data-value');
        inputElement.value += value;
        checkAnswer(inputElement.value.trim());
    });
});

inputElement.addEventListener("input", () => {
    checkAnswer(inputElement.value.trim());
});
