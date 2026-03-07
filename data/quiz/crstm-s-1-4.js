window.QUIZ_DATA = {
  title: 'Iсторична гра: Зимова версія',
  background: 'Crstm_SB_2.jpg',
  theme: {
    textColor: '#091f70',
    accentColor: '#0c0345',
    cardBg: '#220fd3'
  },
  password: 'Автономія',
  questions: [
    {
      type: 'text',
      text: '1. Кріпосницькі відносини в Наддніпрянській Україні почалися',
      correct: '1722',
      placeholder: 'Введіть дату (напр. 1783)'
    },
    {
      type: 'sequence',
      text: '2. Установіть послідовність ліквідації української автономії в XVIII ст',
      correctOrder: ['item3', 'item4', 'item1', 'item2'],
      items: [
        { id: 'item1', label: 'початок діяльності Другої Малоросійської колегії' },
        { id: 'item2', label: 'перший поділ Речі Посполитої' },
        { id: 'item3', label: 'утворення Правління гетьманського уряду' },
        { id: 'item4', label: 'початок гетьманування К. Розумовського' }
      ]
    },
    {
      type: 'choice',
      text: '3. Людина на портреті була гетьманом, але яким?',
      image: 'Crstm_SI_1_4.jpg',
      group: 'style',
      correct: 'Розумовський',
      options: [
        { label: 'Останнім, це К. Розумовський', value: 'Розумовський' },
        { label: 'Першим, це Дмитро Вишневецький', value: 'Київщина' },
        { label: 'Іван Мазепа, рубіжний гетьман', value: 'модерн' }
      ]
    }
  ]
};
