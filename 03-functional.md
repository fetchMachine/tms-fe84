# Функциональное программирование

## Основы функционального программирования

<!-- Функции - строительный блок ПО, а само ПО - процесс редуцирования функциональной композиции.
Ограничение ФП - отсутствие состояния (отсутствие переменных в ФП языках), возможно только персистентное хранилище. -->

Принципы ФП:

- чистые функции (ссылочная прозрачность)
- функции - объекты первого класса
- Иммутабельность данных

## Чистые функции

Чистая функция - функция обладающая следующими свойствами:

- детерминированность - для одних и тех же входящий параметров всегда возвращает один и тот же результат (например, функции имеющие внутреннее состояния или использующие Math.random - не детерминированы).
- отсутствие побочных эффектов (сайд эффектов) - функция должна использовать только переданные аргументы и не должна взаимодействовать с окружающей средой (например, нельзя мутировать входящие аргументы, читать или изменять переменные из внешней области видимости, делать запросы на бекенд или вывод в консоль).

```typescript
  // чистая функция
  const sum = (a: number, b: number): number => a + b;

  // грязная функция, т.к. взаимодействует с внешней областью видимости
  const log = (msg: string) => console.log(msg);

  // грязная функция, т.к. не детерминирована
  const getRandomNumber = (min: number, max: number): number =>
    Math.floor(Math.random() * (max - min + 1) + min)
```

Преимущества чистых функций:

- легко тестировать, т.к. нет внешних зависимостей, которые нужно мокать
- легко переиспользовать, т.к. не зависят от контекста

## Иммутабельность данных

Мы не должны изменять значения переменных / констант после их создания, а должны создавать новые константы.

- используем только const
- не изменяем аргументы функций
- не мутируем объекты / массивы / аргументы функции
- перед использованием мутирующих свойств массива (напр .sort) создаем его копию

## map, filter, reduce

```typescript
const users = [
  { id: 1, name: 'Alex', isBanned: false, account: 10 },
  { id: 2, name: 'Boris', isBanned: false, account: 23 },
  { id: 3, name: 'Freddie', isBanned: false, account: 34 },
  { id: 4, name: 'Petro', isBanned: false, account: 12 },
];

// map - возвращает новые массив, преобразуя каждый элемент исходного массива
const banUserById = (id) => users.map((user) => user.id === id ? { ...user, isBanned: true } : user);

// filter - возвращает новый массив, путем фильтрации исходного
const getBannedUsers = () => users.filter(({ isBanned }) => isBanned);

// reduce (сверстка) - приведение массива к единому результирующему значению по заданному алгоритму
const getTotalAccountValue = user.reduce((acc, user) => acc + user.account, 0);

const flatArray = (array) => array.reduce((acc, el) => acc.concat(el), []);
flatArray([[1, 2], [3, 4, 5]]) // [1, 2, 3, 4, 5]
```

## Функции высшего порядка

Функции высшего порядка - функция, которая принимает функции в качестве параметра и возвращает функцию как результат своего выполнения. Применяется для создания новых функций на основе уже существующего путем добавления дополнительного функционала.

```typescript
// Например, создадим функцию высшего порядка, которая будет логировать в консоль все параметру функции
const withLogParams = (f) => {
  return (...args) => {
    console.log(`function "${f.name}" was called with params: ${args.join(', ')}`);

    return f(...args);
  }
}

const sum = (a: number, b: number): number => a + b;

const sumWithLog = withLogParams(sum);
const result = sumWithLog(2, 3);
console.log(result);
```

## Каррирование / частичное применение

Каррирование - приведение функции n арности к последовательности из n функции единичной арности.

```typescript
  sum(1, 2, 3, 4, 5, 6, 7, 8)

  sum(1)(2)(3)(4)(5)(6)(7)(8);
```

Частичное применение - создание новой функции на основе уже существующей, путем применения одного или более ее параметров

```typescript
const log = (msg: string, role: 'admin' | 'guest') => { ... }

// создали новую функцию logAsAdmin на основе log, путем применения параметра role
const logAsAdmin = (msg: string) => log(msg, 'admin');

// для частичного применения удобно использовать метод bind, который первым параметром принимает значение this, а последующими - параметры для частичного применения
const logAsAdmin = log.bind(null, 'admin');


// можно применять любое кол-во параметров исходной функции
const getData = (userName, password, url, onError) => { ... }

const getMyData = getData.bind(null, 'qwerty', '12345');
```

## Функциональная композиция

Композиция функций — это применение одной функции к результату другой.
``G(F(x)) = (G * F)(x)``

Например, у нас есть массив пользователей и мы хотим выполнить над ними следующие операции:

- отфильтровать зарегистрированных в акции
- начислить всем участвующим в акции по 1 скидочному купону
- выбрать среди всех участников победителя

```typescript
interface User {
  id: number;
  name: string;
  isEnrolled: boolean;
  coupons: string[];
}

const filterPromotionalUser = (users: User[]): User[] => users.filter(({ isEnrolled }) => isEnrolled);

const chargeCoupons = (users: User[]): User[] => users.map((user) => ({ ...user, coupons: [ ...user.coupons, 'ny2022' ] }));

const pickAWinner = (users: User): User => users[getRandomNumber(0, users.length - 1)];

const users = [
  { id: 1, name: 'Alex', isEnrolled: true, coupons: [] },
  { id: 2, name: 'Boris', isEnrolled: false, coupons: [] },
  { id: 3, name: 'Freddie', isEnrolled: true, coupons: [] },
  { id: 4, name: 'Petro', isEnrolled: true, coupons: [] },
];

pickAWinner(chargeCoupons(filterPromotionalUser(users)));

flow(
  filterPromotionalUser,
  chargeCoupons,
  pickAWinner
)(users);
```
