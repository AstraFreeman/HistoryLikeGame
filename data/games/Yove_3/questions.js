// Questions.js - Мем питання для гри Tower Defense

const QUESTIONS = [
    {
        id: 1,
        imagePath: "Images/q1.jpg",
        questionText: "Який прийом використано для хіхоньок",
        answers: [
            "гіпербола",
            "гра слів",
            "метафора"
        ],
        correctAnswer: 1,
        explanation: "Каламбур - наше все (ні)"
    },
    {
        id: 2,
        imagePath: "Images/q2.jpg",
        questionText: "Який це формат мему?",
        answers: [
            "Діалог в пп",
            "Порівняння",
            "пост в соц. мережах"
        ],
        correctAnswer: 2,
        explanation: "Мем 'Галактичний мозок' показує все більш просвітлені думки!"
    },
    {
        id: 3,
        imagePath: "Images/q3.jpg",
        questionText: "Яким чином відбувається панчлайн?",
        answers: [
            "підтасування фактів",
            "маніпуляція фактам",
            "Степан"
        ],
        correctAnswer: 0,
        explanation: "Цей мем ідеально підходить для вираження збентеження!"
    },
    {
        id: 4,
        imagePath: "Images/q4.jpg",
        questionText: "Цей мем зазвичай використовується для показу:",
        answers: [
            "Успіху",
            "Невдачі",
            "Байдужості"
        ],
        correctAnswer: 0,
        explanation: "Мем 'Успішна дитина' святкує маленькі перемоги!"
    },
    {
        id: 5,
        imagePath: "Images/q5.jpg",
        questionText: "Що зазвичай представляє мем 'Карен'?",
        answers: [
            "Допомагаюча людина",
            "Вимогливий клієнт",
            "Тихий спостерігач"
        ],
        correctAnswer: 1,
        explanation: "Мем 'Карен' представляє вимогливу, зарозумілу поведінку!"
    },
    {
        id: 6,
        imagePath: "Images/q6.jpg",
        questionText: "Цей формат мему з Дрейком використовується для:",
        answers: [
            "Показу переваг",
            "Визначення часу",
            "Підрахунку чисел"
        ],
        correctAnswer: 0,
        explanation: "Мем з Дрейком показує відмову проти схвалення варіантів!"
    },
    {
        id: 7,
        imagePath: "Images/q7.jpg",
        questionText: "Мем 'Все гаразд' з собакою представляє:",
        answers: [
            "Все ідеально",
            "Заперечення в кризі",
            "Святкування успіху"
        ],
        correctAnswer: 1,
        explanation: "Показує збереження спокою, коли все руйнується!"
    },
    {
        id: 8,
        imagePath: "Images/q8.jpg",
        questionText: "Жаба Пепе походить з якого коміксу?",
        answers: [
            "Клуб хлопців",
            "Веб-комікси",
            "Смішні жаби"
        ],
        correctAnswer: 0,
        explanation: "Пепе походить з коміксу Метта Фурі 'Клуб хлопців'!"
    },
    {
        id: 9,
        imagePath: "Images/q9.jpg",
        questionText: "Мем 'Стонкс' стосується:",
        answers: [
            "Приготування їжі",
            "Фінансових рішень",
            "Ігор"
        ],
        correctAnswer: 1,
        explanation: "Мем 'Стонкс' висміює поведінку на фінансовому ринку!"
    },
    {
        id: 10,
        imagePath: "Images/q10.jpg",
        questionText: "Меми Among Us стали популярними через:",
        answers: [
            "Милих персонажів",
            "Теми підозри та зради",
            "Яскраву графіку"
        ],
        correctAnswer: 1,
        explanation: "Механіка обману в грі створила ідеальний матеріал для мемів!"
    },
    {
        id: 11,
        imagePath: "Images/q11.jpg",
        questionText: "Формат мему 'Змініть мою думку' використовується для:",
        answers: [
            "Висловлення спірних думок",
            "Запиту напрямків",
            "Обміну рецептами"
        ],
        correctAnswer: 0,
        explanation: "Формат Стівена Краудера представляє спірні твердження!"
    },
    {
        id: 12,
        imagePath: "Images/q12.jpg",
        questionText: "Мем 'Жінка кричить на кота' поєднує:",
        answers: [
            "Два не пов'язані зображення",
            "Фото кота і собаки",
            "Фото їжі"
        ],
        correctAnswer: 0,
        explanation: "Він поєднує сварку з реаліті-шоу з збентеженим котом!"
    },
    {
        id: 13,
        imagePath: "Images/q13.jpg",
        questionText: "Мем 'Великий Чунгус' зображує:",
        answers: [
            "Великого кролика",
            "Маленьку мишку",
            "Звичайного кота"
        ],
        correctAnswer: 0,
        explanation: "Великий Чунгус - це збільшений Багз Банні!"
    },
    {
        id: 14,
        imagePath: "Images/q14.jpg",
        questionText: "Мем 'Рікрол' включає:",
        answers: [
            "Танцювальні відео",
            "Несподівані посилання на пісню",
            "Кулінарні уроки"
        ],
        correctAnswer: 1,
        explanation: "Рікролінг обманює людей, змушуючи дивитися 'Never Gonna Give You Up'!"
    },
    {
        id: 15,
        imagePath: "Images/q15.jpg",
        questionText: "Мем 'Здивований Пікачу' виражає:",
        answers: [
            "Очікувані результати",
            "Шокуючі відкриття",
            "Передбачувані наслідки"
        ],
        correctAnswer: 2,
        explanation: "Використовується, коли очевидні наслідки відбуваються як очікувалося!"
    }
];

// Utility functions for question management
class QuestionManager {
    constructor() {
        this.currentQuestionIndex = 0;
        this.usedQuestions = [];
        this.availableQuestions = [...QUESTIONS];
    }

    // Get next random question
    getNextQuestion() {
        if (this.availableQuestions.length === 0) {
            // Reset if all questions used
            this.availableQuestions = [...QUESTIONS];
            this.usedQuestions = [];
        }

        const randomIndex = Math.floor(Math.random() * this.availableQuestions.length);
        const question = this.availableQuestions[randomIndex];
        
        // Move question from available to used
        this.availableQuestions.splice(randomIndex, 1);
        this.usedQuestions.push(question);
        
        return question;
    }

    // Get question by ID
    getQuestionById(id) {
        return QUESTIONS.find(q => q.id === id);
    }

    // Get total number of questions
    getTotalQuestions() {
        return QUESTIONS.length;
    }

    // Reset question manager
    reset() {
        this.currentQuestionIndex = 0;
        this.usedQuestions = [];
        this.availableQuestions = [...QUESTIONS];
    }

    // Shuffle answers for a question (optional feature)
    shuffleAnswers(question) {
        const shuffled = [...question.answers];
        const correctText = shuffled[question.correctAnswer];
        
        // Fisher-Yates shuffle
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        
        // Find new position of correct answer
        const newCorrectIndex = shuffled.indexOf(correctText);
        
        return {
            ...question,
            answers: shuffled,
            correctAnswer: newCorrectIndex
        };
    }
}

// Export for use in main game script
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { QUESTIONS, QuestionManager };
}