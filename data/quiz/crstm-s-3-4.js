window.QUIZ_DATA = {
  title: 'Iсторична гра: Зимова версія',
  background: 'Crstm_SB_4.jpg',
  theme: {
    textColor: '#0f0a01',
    accentColor: '#7b7a29',
    cardBg: '#c6bd50'
  },
  password: 'Буковина',
  questions: [
    {
      type: 'text',
      text: 'У якому столітті відбулося закріпачення селянства на українських землях, що входили до складу Російської імперії?',
      correct: 'ХVІІІ',
      placeholder: 'Введіть дату (напр., XVI)'
    },
    {
      type: 'choice',
      text: 'У 1772 р. Галичина увійшла до складу володінь австрійських Габсбургів у результаті',
      group: 'MRK',
      correct: 'поділи',
      options: [
        { label: 'поділу Речі Посполитої', value: 'поділи' },
        { label: 'наполеонівських війн у Європі.', value: 'Полки' },
        { label: 'австро-турецької війни.', value: 'Ющенко' }
      ]
    },
    {
      type: 'choice',
      text: 'Пам\'ятка архітектури, зображена на фото, є окрасою міста',
      group: 'style',
      correct: 'Києв',
      image: 'Crstm_SI_3_4.jpg',
      options: [
        { label: 'Києва', value: 'Києв' },
        { label: 'Харкова', value: 'класицизму' },
        { label: 'Одеси', value: 'модерн' }
      ]
    }
  ]
};
