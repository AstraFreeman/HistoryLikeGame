window.QUIZ_DATA = {
  title: 'Iсторична гра: Зимова версія',
  background: 'Crstm_SB_1.jpg',
  theme: {
    textColor: '#097009',
    accentColor: '#034526',
    cardBg: '#ffffff'
  },
  password: 'Запорізька Січ',
  questions: [
    {
      type: 'text',
      text: '1. У якому році територія Кримського ханства увійшла до складу Російської імперії?',
      correct: '1768',
      placeholder: 'Введіть дату (перед 1775)'
    },
    {
      type: 'sequence',
      text: '2. Установіть послідовність подій XVIII ст.',
      correctOrder: ['item3', 'item1', 'item4', 'item2'],
      items: [
        { id: 'item1', text: 'заснування Нової (Підпільненської) Січі' },
        { id: 'item2', text: 'закріпачення селян Лівобережної та Слобідської України' },
        { id: 'item3', text: 'ухвалення Конституції Пилипа Орлика' },
        { id: 'item4', text: 'початок Коліївщини' }
      ]
    },
    {
      type: 'choice',
      text: '3. Із зображеним на фото собором тісно пов\'язана діяльність митрополита',
      group: 'style',
      correct: 'Шептицький',
      image: 'Crstm_SI_2_5.jpg',
      options: [
        { label: 'Петра Могили.', value: 'Розумовський' },
        { label: 'Андрея Шептицького', value: 'Шептицький' },
        { label: 'Феофана Прокоповича.', value: 'модерн' }
      ]
    }
  ]
};
