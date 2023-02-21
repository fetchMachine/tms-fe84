# Redux Toolkit Pagination

## Подключение к бекенду
- Создаем новый проект
- Для работы будет использовать ендпоинт https://docs.api.jikan.moe/#tag/anime/operation/getAnimeSearch
- Создать папку api. В ней должны быть функции ``get`` (создает url  и searchParams, вызывает resp.json()) и ``getAnime`` (вызывает функцию get с нужным урлом). Делать по аналогии с [weather-app](https://codesandbox.io/s/weatherapp-toolkit-uieek3)
- Создать и подключить редакс стор с помощь @reduxjs/toolkit. ``interface State { items: Anime[]; loadStatus: LOAD_STATUSES }``.
- Для интеграции с бекендом создать actionCreator с помощью createAsyncThunk и функции getAnime (из папки api)
- Вывести полученные аниме на ui в виде списка

## Табличный вид
- Подключить библиотеку [Ant Design](https://ant.design/)
- Не забыть импортнуть стили в App ``import 'antd/dist/reset.css';``
- Заменить список аниме на табличный вид используя компонент таблицу из Ant Design

## Пагинация и фильтрация
- Добавить возможность пагинации и выбора кол-ва строк в таблице. Для этого использовать соответствующие пропсы таблицы и квери параметры page и limit.
- Добавить два любых фильтра. Для этого вывести на ui отдельные компоненты (использовать компоненты Ant Design. Например, Input для поиска по названию) и необходимые квери параметры (например q для поиска по названию).
