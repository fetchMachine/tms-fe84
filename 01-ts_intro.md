## ОКРУЖЕНИЕ
- [Playground](https://www.typescriptlang.org/play)
- typescript / ts-node / nodemon

## TYPESCRIPT ЭТО
- надмножество JS
- предоставляет статическую проверку типов, автокомплит, возможность компилировать код в разные версии JS
- структурная типизация
- требует конфигурации
- автоматически выводит типы
- **СУЩЕСВУЕТ ТОЛЬКО НА ЭТАПЕ КОМПИЛЯЦИИ**

## Базовые типы (number, string, boolean)

## Массивы, кортежи, перечисления

## Другие простейшие типы (Any, Unknown, Never, Void)

## Преобразования типов
<>
as

## Защитники типов и различение типов

## Интерфейсы (свойства, расширения)
[type vs interface](https://www.typescriptlang.org/play/typescript/language-extensions/types-vs-interfaces.ts.html)
optional
readonly
extendes / &
ReadonlyArray<string>
readonly string[]
as const
readonly [string, number]

```typescript
// Index Signature
interface StringArray {
  [index: number]: string;
}
```

## Объединённые и пересекающиеся типы, литеральные типы
Составные строковые литералы
// Intersection  type ColorfulCircle = Colorful & Circle;

## Функции (аргументы, контекст, перегрузка функции)
