# Redux toolkit

Один из минусов redux - необходимость писать много повторяющегося кода даже для решения крайне простых задача. redux-toolkit - библиотека от разработчиков redux которая решает эту проблему.

## Установка
```bash
npm install @reduxjs/toolkit
```

## Применение

### Компоненты
redux-tookit никак не изменяют способ работы с компонентами, поэтому код компонентов при переходе с redux на redux-toolkit никак не изменится с функциональной точки зрения. Но вероятно после изменения структуры сторы (переименования папок и переменных в папке store) нужно будет исправить импорты в компонентах.

### Store
Для создания стора используем функцию ``configureStore`` из пакета redux-toolkit

```javascript
import { combineReducers, configureStore  } from '@reduxjs/toolkit'

const rootReducer = combineReducers({})

const store = configureStore({ reducer: rootReducer  });
```

При необходимости можно задавать дополнительные настройки, такие как включение / выключение devtools, redux-thunk и дополнительных проверок. Например:

```javascript
const store = configureStore({
    reducer: rootReducer,
    devTools: true,
     middleware: (getDefaultMiddleware) => getDefaultMiddleware({ thunk: true, serializableCheck: false }),
});
```

Но все эти полезные настройки уже включены по умолчанию, поэтому достаточно лишь сконфигурировать reducer.

### Reducer / actions / actionCreators
Уменьшение количества необходимого кода достигается в первую очередь тем, что у нас есть функция ``createSlice``, которая создает для нас сразу и redcuer и actions и actionCreators и все необходимые типы для них

```
export const { actions, reducer } = createSlice({
    name: 'counter' ,
    initialState: { value: 0 },
    reducer: {
        increase: (store) => {
            store.value++;
        },
        decrease: (store) => {
            store.value--;
        }
    }
});
```

Составляющие slice:
**name** - имя слайса. Его вы увидите в devtools и оно будет подставлено во все экшены как префикс, чтобы избежать конфликта экшенов с одинаковым именем в разных слайсах. Это аналог префкиса, который мы добавляли сами в каждый экшен когда создавали enum всех возможных экшенов.


**initialState** - начальное состояние.


**reducer** - это одновременно **и actionCreator и *reducer**. Раньше мы писали reducer как набор switch/case который обрабатывал action.type. При создании слайса мы пишем маленькие редюсеры для каждого отдельного action.type. Т.е. можно думать, что каждый такой маленький reducer (например, increase и decrease из примера выше) добавляет очередной case в switch/case конструкцию итогового reducer.

Так код каписанный на redux-tookit из примера выше является аналогом следующего кода, написанного на чистом redux:
const initialState =  { value: 0 };

```javascript
const reducer = (store = initialState, action) => {
    switch (action.type) {
        // поле "increase" из redcuer становится action.type. А поле name - префиксом.
        case 'counter/increase': {
            return { ...store, value: store.value + 1 }
        }
        
        case 'counter/decrease': {
            return { ...store, value: store.value - 1 }
        }
    
        default: {
            return store;
        }
    }
}
```

Если store создается с помощью configureStore, как было показано выше, то его можно "мутировать". На самом деле можно лишь писать код в стиле мутаций. Мутации перехватываются под капотом и вместо мутации возвращается новый обновленный стор. Такой синтаксис мутаций позволяет избавиться от мержа предыдущего состояния, например, вместо:

```
    case 'addTask': {
        return { ...prevStore, tasks: [ ...prevStore.tasks, newTask ] }
    }
```
можно писать так:
```
reducer: {
    addTask: (store) => {
        store.tasks.push(newTask);
    }
}
```

**Важно!** Можно или "мутировать" или возвращать новый стор без мутации. Если и смутировать и вернуть стор, то будет ошибка.

### redux-thunk 

При получении данных с бека мы в большинстве случаев хотим не только получить их, но и управлять статусами загрузки, чтобы показывать лоадер или сообщения об ошибке. Для этого каждое получение данных сопровождается тремя дополнительными диспатчами: диспатч на начало загрузки (показываем лоадер), диспатч на ошибку загрузки (снимаем лоадер и показываем сообщение об ошибке) и диспатч успешной загрузки (снимаем лодаер и показываем данные).

Функция createAsyncThunk принимает любую асинхронную функцию и возвращает **actionCreator** который под капотом диспатчит все эти три дополнительных екшена.

```javascript
const fetchSomeData = () => fetch(...)

const getData = createAsyncThunk('slicePrefix', fetchSomeData);
```

getData - actionCreator. Все три экшен тайпа, которые он будет диспатчить можно посмотреть с помощью:

```
getData.pending.toString(); - загрузка
getData.fulfilled.toString(); - успех. получение данные будут в поле payload
getData.rejected.toString(); - ошибка
```

### extraReducers
При создании слайса с помощью createSlice в поле reducers нам создаются ***и reducer и actionCreators***
Если нам надо в слайсе обрабатывать уже существующие экшены (т.е. создать **reducer** без создания **actionCreators**) мы используем поле extraReducers. Такое может понадобиться, если нам надо обработать екшены другого слайса, или при работе с createAsyncThunk (пример выше) т.к. createAsyncThunk уже создал actionCreator и нам нужно лишь обработать его екшен в reducer.

```javascript
const getData = createAsyncThunk('slicePrefix', fetchSomeData);

const slice = {
    name,
    initialStore: { data: [], loadStatus: 'unknown' },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getData.pending, (state, action) => {
          state.loadStatus = 'loading';
        });

        builder.addCase(getData.fulfilled, (state, action) => {
          state.loadStatus = 'loaded';
          state.data = action.payload;
        });

        builder.addCase(getData.rejected, (state, action) => {
          state.loadStatus = 'error';
        })
  },
}
```
