
// создать с помощью Record тип объекта ключи которого любая строка, а значения строка или число
type myCollectionOfNumberOrString = any;

interface User {
  id: number;
  name: string;
  age: number;
  friends: User[];
}

// создать интерфейс на основе User у которого нет поля id, а все остальные поля - опциональные
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
