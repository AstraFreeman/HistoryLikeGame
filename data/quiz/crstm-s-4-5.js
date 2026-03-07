window.QUIZ_DATA = {
  title: 'Iсторична гра: Зимова версія',
  background: 'Crstm_SB_5.jpg',
  theme: {
    textColor: '#ffffff',
    accentColor: '#8b0000',
    cardBg: '#b22222'
  },
  password: 'В цьому тесті це кінець. Поки що',
  questions: [
    {
      type: 'text',
      text: 'Роки існування Гетьманщини',
      correct: '1648-1764',
      placeholder: 'від Хмлн до Рзмв'
    },
    {
      type: 'choice',
      text: 'Гайдамацький та опришківський рухи у ХVІІІ ст. були спрямовані проти експлуатації українського селянства',
      group: 'MRK',
      correct: 'шляхта',
      options: [
        { label: 'російським дворянством', value: 'Автономія' },
        { label: 'кримськотатарськими ханами.', value: 'Полки' },
        { label: 'польською шляхтою', value: 'шляхта' }
      ]
    },
    {
      type: 'choice',
      text: 'Кого наслідує лідер зображений на малюнку?',
      group: 'style',
      correct: 'Скрпд',
      image: 'UR_1918_2.png',
      options: [
        { label: 'московських дворян', value: 'Самар' },
        { label: 'козацьку старшину', value: 'Скрпд' },
        { label: 'польскушляхту', value: 'модерн' }
      ]
    }
  ]
};
