
// создать с помощью Record тип объекта ключи которого любая строка, а значения строка или число
type myCollectionOfNumberOrString = any;

// создать тип на основе BaseType с помощью утилити тайпов, но все поля должны быть обязательны
interface BaseType {
  id: number;
  age?: number;
  name?: string;
}

type RequiredType = any;

// создать тип на основе BaseType с помощью утилити тайпов, но все поля должны быть ридонли
type ReaodnlyType = any;

// вывести с помощью утилити тайпов тип возвращаемого значения функции
const sum = (a: number, b: number): number => a + b;

type SumReturn = any;

// создать тип на основе данного выбрав только поля id и label
interface Car {
  id: number;
  price: number;
  label: string;
}

type CarNoCost = any;

// создать интерфейс на основе User у которого нет поля id, а все остальные поля - опциональные
interface User {
  id: number;
  name: string;
  age: number;
  friends: User[];
}

type NewUser = any;

// Написать дженерик тип, который достает второй параметр функии
type Sum = (a: number, b: number) => number;
type Log = (msg: string, role: 'admin' | 'user') => number;

type SecondParam = any;
// напр: SecondParam<typeof Sum> => number
// напр: SecondParam<typeof Log> => 'admin' | 'user'

// сделать тип обязательным с помощью утили тайпов, т.е. чтобы не мог быть null
type Type = string | number | boolean | null | undefined;
type TypeWithNull = any;

// написать дженерик обратный NonNullable, т.е. чтобы к текущему типу добавлся тип null | undefined;
type Nullable = any;

// с помощью дженерика затипизировать функцию
const packToObject = (value) => ({ value });

// Создать класс Logger применив интерфейс ILogger
interface ILogger {
  log: () => void;
}

class Logger {};

// сделать метод доступным только самого класса, метод logB доступным для самого класса и классов наследников,
// метод статическим и доступным только для самого класса
class TestClassA {
  logA () {}

  logB () {}

  logC () {}
}

class TestClassB extends TestClassA {
  log () {
    // this.logA(); // должен быть недоступен
    this.logB(); // должен быть ок
  }
}


// не создавая новые типы затипизировать функцию startWatch
class Watcher {
  watch () {}
}

const startWatch = (value) => {
  value.watch();
}
