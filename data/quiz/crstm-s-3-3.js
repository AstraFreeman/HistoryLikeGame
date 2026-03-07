window.QUIZ_DATA = {
  title: 'Iсторична гра: Зимова версія',
  background: 'Crstm_SB_3.jpg',
  theme: {
    textColor: '#0f0a01',
    accentColor: '#7b7a29',
    cardBg: '#c6bd50'
  },
  password: 'Галичина',
  questions: [
    {
      type: 'text',
      text: '1. утворення коронного краю «Королівство Галіції та Лодомерії» у складі Австрії це наслідок Другого поділу Речі посполитої. Коли цей поділ відбувся',
      correct: '1793',
      placeholder: 'Введіть цифру (17..)'
    },
    {
      type: 'sequence',
      text: '2. Установіть послідовність подій державно-політичного життя XVIII ст.',
      correctOrder: ['item3', 'item4', 'item2', 'item1'],
      items: [
        { id: 'item1', text: 'Ліквідація гетьманства' },
        { id: 'item2', text: 'Заснування Нової (Підпільненської) Січі' },
        { id: 'item3', text: 'Полтавська битва' },
        { id: 'item4', text: 'Утворення Малоросійської колегії на чолі з бригадиром С. Вельяміновим.' }
      ]
    },
    {
      type: 'choice',
      text: '3. За стильовими ознаками ці споруди виконані в стилі',
      group: 'style',
      correct: 'бароко',
      image: 'Crstm_SI_3_3.jpg',
      options: [
        { label: 'бароко', value: 'бароко' },
        { label: 'класицизм', value: 'Гайдамаки' },
        { label: 'модерн', value: 'модерн' }
      ]
    }
  ]
};
