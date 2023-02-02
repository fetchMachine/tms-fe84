# react-router-dom

## Мотивация
Отличительная особенность SPA - отсутствие перезагрузки страницы при переходе по ссылкам. Для этого надо
  - понимать на какой странице сейчас находится пользователь и рисовать ui исходя из этого (на странице регистрации показывать ui регистрации, на странице списка товаров магазина показывать этот список и т.д.)
  - при переходе пользователя по ссылке перехватить и отменить этот переход и вместо этого нарисовать новый ui в зависимости от того на какую страницу хотел перейти пользователь.

Для этого нам нужна библиотека **react-router-dom**.

## Подготовка
  - Установка библиотеки: ```npm i react-router-dom```
  - Обязательно оборачиваем **ВСЕ** наше приложение в контекст роутера
```javascript
// компонент называется BrowserRouter, мы импортируем его и переименовываем для удобства в просто Router
import { BrowserRouter as Router } from "react-router-dom";

ReactDOM.render(
    <Router>
        <App />
    </Router>,
    rootElement,
);
```

## Рендер определенной страницы
Для отображения наших компонентов согласно текущему url используем компоненты ```<Routes />``` и ```<Route />```

  - Route - **компонент для условного рендера наших страниц**. Принимает пропсы ```path``` и ```element```, если ```path``` совпал с текущем url, то рендерит ```element```, если не совпал - не рендерит
  - Routes - Оборачиваем в этот компонент группу наших ```Route```. Можно думать, как об аналоге switch/case. Принимает в себя ```Route``` и рендерит только первый (т.е. если у какого-либо ```Route``` совпал ```path``` и он соответственно отрендерил ```element```, то остальные ```Route``` просто игнорируются)

```javascript
import { Routes, Route } from 'react-router-dom';

const App = () => {
    return (
      <Routes>
        {/* path - пустая строка, сработает при отсутствующем пути, например my-site.com */}
        <Route path="" element={<Main />} />
        {/* сработает для my-site.com/tasks */}
        <Route path="tasks" element={<Tasks />} />
        {/* сработает для my-site.com/login */}
        <Route path="login" element={<Login />} />
        {/* сработает для любого пути my-site.com/login. Вставляем в конец, чтобы в случае если ни один Route не подошел, то для любого другого роута показать страницу 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    )
}
```

### Защищенные страницы
Если какие-то страницы нужно показывать только для определенных пользователей (только для зарегистрированных или только для админов и тд), то просто используем условный рендер

```javascript
import { Routes, Route, Navigate } from 'react-router-dom';
const App = () => {
    const [ isUserAthorized, setIsUserAthorized ] = useState(false);

        return (
            <Switch>
                { /* если пользователь авторизован - показывать ему страницу профиля, иначе не показывать */ }
                { isUserAthorized && <UserPage /> }
            </Switch>
    )
}
```

### Redirect
Для того чтобы перенаправлять пользователя с одного урла на другой используется компонент ```<Navigate />```. Например, выше мы показывали страницу 404 если ни один роут не подошел, давайте вместо этого делать редирект на главную страницу

```javascript
import { Routes, Route, Navigate } from 'react-router-dom';
const App = () => {
    return (
      <Routes>
        <Route path="" element={<Main />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="login" element={<Login />} />

        <Route path="*" element={<Navigate to="" />} />
      </Routes>
    )
}
```

Еще один пример. Один и тот же роут иногда должен работать по-разному в зависимости от состояния приложения. Например, делать редирект с защищенной страницы на страницу логином, если юзер не зарегистрирован или на главную со страницы логина если уже зарегистрирован.
```javascript
import { Routes, Route, Navigate } from 'react-router-dom';
const App = () => {
    const [ isUserAthorized, setIsUserAthorized ] = useState(false);

        return (
            <Switch>
                {/* если юзер уже авторизован, то перенаправляем его на нашу главную страницу */}
                <Route path="/login" element={ isUserAthorized ? <Redirect to=""> : <LoginPage onSuccess={ () => setIsUserAthorized(true) } /> } />


                 { /* если юзер авторизован, то показываем ему нашу секретную страницу, иначе перенаправляем на страницу логина */ }
                <Route path="/secret" elemen={ isUserAthorized ? <SecretPage /> : <Navigate to="/login"> } />
            </Switch>
    )
}
```

### Динамичные роуты
Часто стоит задача создавать динамичные роуты, т.е. роуты у которых часть пути может изменяться (быть любой), например, роут вида ```users/456``` который должен отобразить страницу пользователя с id 456. В таких случаях мы не создаем роуты и страницы для каждого возможного id, вместо делаем одну универсальную страницу и один **динамический** роут.
Для использования динамичных роутов нужно сделать 2 вещи
  - создать динамический роут задав path с префиксом ":" (например ":id" или например ":taskId"). Как назовете путь после префикса, под таким именем получите его значение в компоненте.
  - получить конкретное значение роута на странице с помощью хука useParams.

```javascript
import { Routes, Route } from "react-router-dom";

const App = () => {
    return (
      <Routes>
        {/* для урла содержащие id (например /tasks/4 или /tasks/99) отображаем страницу конкретной задачи */}
        { /* динамический роут содержит в себе идентификатор и обязательный префикс двоеточия. Называть идентификатор можно как угодно, позже он под этим именем будет доступен в компоненте */ }
        <Route path="tasks/:id" element={ <Task /> } />
        {/* для урла без id показываем весь список задач */}
        <Route path="tasks" element={ <Tasks /> } />
      </Routes>
    )
}

import { useParams } from "react-router-dom";

const Task = () => {
    // useParams возвращает объект, у которого есть поле с вашим идентификатором (то как вы называли ваш динамический роут. Выше мы назвали его ```:id```, значит тут будет поле id)
    const { id } = useParams();
    
    const [ data, setDate ] = useState(null);
    
    useEffect(() => {
        // получаем уканильную информацию по ид
        getSomeDataFromBackendById(id).then(data => setData(data));
    }, [ id ]);
    
    return data && <span>{ data }</span>
}
```

### Безусловный рендер
Если какой-то компонент должен быть отображен всегда, в независимости от урла, просто рендерим его вне ```Routes```

```javascript
import { Routes, Route, Navigate } from 'react-router-dom';

const App = () => {
    return (
        <div>
            {/* Компонент Header находится вне компонента Routes, а значит будет рендерится всегда, независимо от урла */}
            <Header />
            <Routes>
                <Route path="" element={<Main />} />
                <Route path="login" element={<Login />} />
                <Route path="*" element={<Navigate to="" />} />
            </Routes>
        </div>
    )
}
```

## Переход между страницами
Для перехвата перехода по ссылкам используем вместо тега ```<a href="" />``` компонент ```<Link to="" />```
```javascript
import { Link } from 'react-router-dom';

export const Menu = () => {
    return (
        <ul>
            {/* было */ }
            {/* <li><a href="/login">Страница логина</a></li> */ }
            {/* <li><a href="/login">Страница логина</a></li> */ }
            {/* <li><a href="/login">Страница логина</a></li> */ }
            
            {/* стало */ }
            <li><Link to="/login">Страница логина</Link></li>
            <li><Link to="/register">Страница регистрации</Link></li>
            <li><Link to="/main">Главная страница</Link></li>
        </ul>
    )
}
```

Если мы хотим перейти на страницу не по ссылке, а с помощью js логики (например, при нажатии на кнопку), то используем хук ```useNavigate```

```javascript
import { useNavigate } from 'react-router-dom';

export const Menu = () => {
    const navigate = useNavigate();
    
    const goToRegistrationPage = () => navigate('/register');
    const goBack = () => navigate(-1); // аналог кнопки назад в браузере
    const goForward = () => navigate(1); // аналог кнопки вперед в браузере

    return (
        <div>
           <button onClick={ goToRegistrationPage }>Registration</button>
           <button onClick={ goBack }>Go Back</button>
           <button onClick={ goForward }>Go Forward</button>
        </div
    )
}
```

Ссылки бывают:
  - относительные - путь добавиться к текущему пути
  - абсолютные (начинаются с `/`) - путь добавится к домену


```javascript
// Например сейчас мы находится на странице my-site.com/tasks
// абсолютная ссылка (начинается с префикса `/`), путь добавится к домену (my-site.com)
<Link to="/register">Страница регистрации</Link> // my-site.com/register
// относительная ссылка, путь добавиться к текущему пути (my-site.com/tasks)
<Link to="register">Страница регистрации</Link> // my-site.com/tasks/register
```

# Доп хуки
- useLocation - объект с текущим урлом (в т.ч. квери параметры)
