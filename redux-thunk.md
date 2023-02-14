# Redux

[архитектура](https://geniusee.com/storage/app/media/blog80/2_.png)

Составные части:
- Store - глобальное состояние (js объект), данные из которого могут потреблять любые компоненты
- Action - событие, обычный js объект с строковым полем type, которое вкратце описывает что произошло (напр произошел клик `{ type:  “click” }`). Опционально может иметь поле payload (если надо передать какую-либо дополнительную информацию)
- dispatch - функция, которая доставляет наш Action в Reducer
- Reducer - **чистая** функция, которая получает текущий store и action и возвращает новый обновленный store.
- useSelector - хук подписки (подписавшись компонент будет перерендереваться на изменение store), который достает нужные данные из store с помощью selector
- selector - функция селектор, которая принимает весь store и возвращает его небольшую часть

# Проблема
Чтобы наши компоненты занимались только одной задачей – отрисовкой ui, мы хотим вынести все логику по изменению данных в redux. В т.ч. и асинхронную логику (например, получения данных с бекенда).

Но у нас нету места где мы могли бы выполнять такую логику:
- store и action - просто объекты
- reducer - функция, но у согласно правилам redux: reducer должен быть чистой функцией, т.е. мы не можем выполнять асинхронную логику в нем.

# Решение
Решением проблемы являются **middlewares**.
Обычный флоу в редаксе: компонент передает action в dispach, а dispach доставляет его в reducer. Middlewares встраиваются в эту цепочку между dispach и reducer:

Было: dispatch => reducer
Стало: dispatch => middlewares => reducer

Пока dispatch доставляет action в reducer мидлвары перехватывают action по пути и могут сделать одно из трех действий:
- сделать какую-либо дополнительную логику (например, логирование) и отпустить action дальше куда он шел (в reducer)
- сделать какую-либо дополнительную логику (например, сетевой запрос) и НЕ пропускать action дальше (т.е. такой action не дойдет до reduer)
- ничего не делать, просто пропустить action дальше куда он шел (в reducer)

# redux-thunk
Существует множество разных мидлвар для решения разных задач. Для решения задач асинхронных запросов существует также разные мидлвары. Мы будем использовать одну из таких: redux-thunk

На данный момент наш action это простой js объект с полем type. Если до reducer дойдет что-то отличное от объектов - мы получим ошибку. Например, если передать в dispatch функцию, то эта функция попадет в reducer и мы увидим ошибку.

redux-thunk позволяет нам передавать в dispatch функцию. Будучи мидварой, redux-thunk смотрит на все action который идут в reducer и если action функция, то эта **функиция вызывается и НЕ передается дальше в reducer** (поэтому мы и не получаем ошибок).

Теперь наши actionCreators могут возвращать action не только в виде объектов, но в виде функции, которые и будут выполнять всю асинхронную логику.

# Подключение redux-thunk
```
// устанавливаем библиотеку
npm install redux-thunk
```

```
// подключаем мидлвару к нашему стор
import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'

const rootReducer = combineReducers({});

const store = createStore(rootReducer, applyMiddleware(thunk))
```

# Использование redux-thunk без параметров
[полный пример с лекции](https://codesandbox.io/s/weatherapp-bkw8t7)

Подключив redux-thunk мы можем создавать actionCreators, которые будут возвращать action не в виде объекта, а в виде функции, например

```typescript
import { Dispatch } from "redux";

// dispatch нам передаст сам redux-thunk когда будет вызывать нашу функцию
// мы можем использовать его, чтобы диспатчить любые action (в т.ч. и функции)
export const fetchWeather = (dispatch: Dispatch) => {
  dispatch(getWeatherStart());

  getWeather()
    .then((weather) => {
      dispatch(getWeatherSuccess(weather));
    })
    .catch(() => {
      dispatch(getWeatherError());
    });
};

const Component = () => {
    const dispatch = useDispatch();
    
    const onClick = () => {
        // мы диспатчим саму функцию, а не результат вызова! Т.е. мы ее не вызываем ее сами, ее вызовет redux-thunk и передаст в нее dispatch
        dispatch(fetchWeather);
    }
}
```

# Использование redux-thunk с параметрами
В примере выше мы не передаем никаких параметров в getWeather, но что, если нам надо их передать? Т.к. нашу функцию вызываем не мы, а redux-thunk, то и параметры в момент вызова передает он, а не мы.

Эту проблему можно решить с помощью замыкания, создав еще одну функцию обертку, которую мы сможем вызвать сами и передать туда любые параметры

```typescript
import { Dispatch } from "redux";

// у нас функция, которая возвращает функцию
// первую функцию мы вызовем сами и передадим туда параметры, результат вызовы - вторая функция
// вторую функцию мы задиспатчим и ее вызовет redux-thunk, передав туда dispatch
export const fetchWeather = (params) => (dispatch: Dispatch) => {
  dispatch(getWeatherStart());

  getWeather(params)
    .then((weather) => {
      dispatch(getWeatherSuccess(weather));
    })
    .catch(() => {
      dispatch(getWeatherError());
    });
};

const Component = () => {
    const dispatch = useDispatch();
    
    const onClick = () => {
        // теперь мы вызываем функцию передавая туда нужные параметры
        dispatch(fetchWeather(params));
    }
}
```

Если нам не нужно передавать никакие параметры, то мы можем использовать синтаксис без замыкания из примера выше. Но для единообразия кода мы всегда будем писать код с замыканием. Пример без параметров, но с замыканием:

```typescript
import { Dispatch } from "redux";

export const fetchWeather = () => (dispatch: Dispatch) => {
  dispatch(getWeatherStart());

  getWeather()
    .then((weather) => {
      dispatch(getWeatherSuccess(weather));
    })
    .catch(() => {
      dispatch(getWeatherError());
    });
};

const Component = () => {
    const dispatch = useDispatch();
    
    const onClick = () => {
        dispatch(fetchWeather());
    }
}
```
