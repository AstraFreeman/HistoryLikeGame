window.QUIZ_DATA = {
  title: 'Iсторична гра: Зимова версія',
  background: 'Crstm_SB_2.jpg',
  theme: {
    textColor: '#091f70',
    accentColor: '#0c0345',
    cardBg: '#220fd3'
  },
  password: 'Скоропадський Іван',
  questions: [
    {
      type: 'text',
      text: 'Коли відбулася битва під Полтавою?',
      correct: '1709',
      placeholder: 'Введіть дату (напр., 1709)'
    },
    {
      type: 'choice',
      text: '2. Діяльність Другої Малоросійської колегії було спрямовано на',
      group: 'MRK',
      correct: 'Автономія',
      options: [
        { label: 'ліквідацію решток автономного устрою Гетьманщини', value: 'Автономія' },
        { label: 'запровадження полкового устрою в Слобідській Україні', value: 'Полки' },
        { label: 'повернення козаків Задунайської Січі на Запоріжжя', value: 'Ющенко' }
      ]
    },
    {
      type: 'choice',
      text: '3. Архітектурний стиль',
      image: 'Crstm_SI_1_1.jpg',
      group: 'style',
      correct: 'бароко',
      options: [
        { label: 'класицизм', value: 'бароко' },
        { label: 'бароко', value: 'класицизму' },
        { label: 'модерн', value: 'модерн' }
      ]
    }
  ]
};
