window.QUIZ_DATA = {
  title: 'Iсторична гра: Зимова версія',
  background: null,
  theme: {
    textColor: '#333',
    accentColor: '#007bff',
    cardBg: '#f4fff4'
  },
  password: 'повстання',
  questions: [
    {
      type: 'text',
      text: '1. Остаточна ліквідація гетьманства',
      correct: '1764',
      placeholder: 'Введіть рік'
    },
    {
      type: 'text',
      text: '2. Остаточна ліквідація царським урядом Запорозької Січі',
      correct: '1775',
      placeholder: 'Введіть рік'
    },
    {
      type: 'text',
      text: '3. Ухвалення Конституції Пилипа Орлика',
      correct: '1710',
      placeholder: 'Введіть рік'
    },
    {
      type: 'choice',
      text: '3. З яким гетьманом пов\'язане зображення?',
      group: 'hetman',
      correct: 'Кирило Розумовський',
      image: 'Crstm_SI_1_5.jpg',
      options: [
        { label: 'Іван Мазепа', value: 'Іван Мазепа' },
        { label: 'Данило Апостол', value: 'Данило Апостол' },
        { label: 'Кирило Розумовський', value: 'Кирило Розумовський' },
        { label: 'Петро Сагайдачний', value: 'Петро Сагайдачний' }
      ]
    }
  ]
};
