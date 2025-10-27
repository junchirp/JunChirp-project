import { WhatWeNeedType } from '@/shared/interfaces/what-we-need.interface';

const emptyBlock: WhatWeNeedType = {
  title: null,
  text: null,
  buttonText: null,
  buttonRoute: '',
};

export const noAuthBlocks: WhatWeNeedType[] = [
  emptyBlock,
  emptyBlock,
  {
    title: '1. Творчий простір для \n натхнення',
    text: 'Всі ресурси для створення креативних проєктів у твоєму розпорядженні. Платформа JunChirp забезпечить все необхідне, щоб ти міг зосередитися на реалізації своїх ідей. Ознайомся з кабінетом і почни творити вже сьогодні!',
    buttonText: 'Знайти натхнення',
    buttonRoute: '/auth/registration',
  },
  {
    title: '2. Розвивай свої навички в \n реальних проєктах',
    text: `Виконуй завдання, вдосконалюй свої скіли і додавай нові до профілю. Рішення реальних задач дозволить тобі рости професійно і набирати досвід, що стане основою для твоєї кар'єри в IT.`,
    buttonText: 'Розпочати завдання',
    buttonRoute: '/auth/registration',
  },
  {
    title: '3. Розширюй своє оточення \n професіоналів',
    text: `Знайди однодумців і разом підкорюйте нові висоти! Будуй мережу контактів серед професіоналів і отримуй нові можливості для розвитку та кар'єрного росту.`,
    buttonText: 'Знайти команду',
    buttonRoute: '/auth/registration',
  },
  emptyBlock,
  emptyBlock,
];

export const authBlocks: WhatWeNeedType[] = [
  emptyBlock,
  emptyBlock,
  {
    title: '1. Хочеш прокачати \n навички?',
    text: 'Обирай проєкт, який тобі цікавий, і приєднуйся!',
    buttonText: 'Переглянути проєкти',
    buttonRoute: '/projects',
  },
  {
    title: '2. Є крута ідея?',
    text: 'Запусти власний проєкт і створи команду мрії!',
    buttonText: 'Створити свій проєкт',
    buttonRoute: '/new-project',
  },
  {
    title: '3. Потрібно більше \n нетворкінгу?',
    text: `Спілкуйся з ком’юніті, знаходь однодумців і корисні інсайти.`,
    buttonText: 'Перейти в чат',
    buttonUrl:
      'https://discord.com/channels/1362056776119488755/1362056776744435947',
  },
  emptyBlock,
  emptyBlock,
];
