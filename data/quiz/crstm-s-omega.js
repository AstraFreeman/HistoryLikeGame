window.QUIZ_DATA = {
  title: 'Iсторична гра: Зимова версія',
  background: 'Crstm_SI_Omega.jpg',
  theme: {
    textColor: '#333',
    accentColor: '#007bff',
    cardBg: '#fff'
  },
  password: 'Богдан Хмельницький',
  questions: [
    {
      type: 'text',
      text: 'Цього року Хмельницький став гетьманом',
      correct: '1648',
      placeholder: 'Введіть рік'
    },
    {
      type: 'choice',
      text: 'Панщина',
      group: 'MRK',
      correct: 'Відробіток',
      options: [
        { label: 'система суспільних відносин, за якої землевласник мав право на особу', value: 'Кріпацтво' },
        { label: 'обов\'язкову працю селянина власним реманентом у господарстві землевласника', value: 'Відробіток' },
        { label: 'велике шляхетське багатогалузеве господарство', value: 'Ющенко' }
      ]
    },
    {
      type: 'choice',
      text: 'Територія Гетьманщини за довговором 1649 р. Яка назва договору?',
      group: 'map',
      correct: 'Зборівський',
      image: 'Crstm_SI_Omega_1.png',
      options: [
        { label: 'Переяславська рада', value: 'бароко' },
        { label: 'Білоцерківський', value: 'класицизму' },
        { label: 'Зборівський', value: 'Зборівський' }
      ]
    }
  ]
};
