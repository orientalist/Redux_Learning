# Store

上一節中我們定義了描述“發生什麼事”的action，以及透過action更新state的Reducer。

Store則是將它們組合再一起的物件。Store具有以下職責：

- 保持App的state
- 透過`getState()`提供訪問state的管道
- 透過`dispatch(action)`更新state 
- 透過`subscribe(listener)`註冊監聽器
- 透過`subscribe(listener)`回傳的方法取消註冊監聽器的方法

注意！每個Redux App都只有一個Store，當你想切分資料邏輯時，你應該新增Reducer。

透過Reducer可以簡單地建立Store。上個章節我們透過`combineReducers()`合併多個Reducer。我們將import入它，並傳遞給`createStore()`。

```js
import { createStore } from 'redux'
import todoApp from './reducers'
const store = createStore(todoApp)
```

你可以透過傳遞客製化初始狀態給`createStore()`作為第二個參數，這對於合併客戶端與伺服器端資料十分有用。

```js
const store = createStore(todoApp, window.STATE_FROM_SERVER)
```

## 發起Actions

我們現在創造了一個Store，讓我們測試他吧！

```js
import {
  addTodo,
  toggleTodo,
  setVisibilityFilter,
  VisibilityFilters
} from './actions'
// Log the initial state
console.log(store.getState())
// Every time the state changes, log it
// Note that subscribe() returns a function for unregistering the listener
const unsubscribe = store.subscribe(() => console.log(store.getState()))
// Dispatch some actions
store.dispatch(addTodo('Learn about actions'))
store.dispatch(addTodo('Learn about reducers'))
store.dispatch(addTodo('Learn about store'))
store.dispatch(toggleTodo(0))
store.dispatch(toggleTodo(1))
store.dispatch(setVisibilityFilter(VisibilityFilters.SHOW_COMPLETED))
// Stop listening to state updates
unsubscribe()
```

你可以觀察store是如何影響state：

![](https://i.imgur.com/zMMtoMz.png)

我們在使用UI操作App錢已可以指明各種行為！我們不會再教程中這麼做，不過你還是可以撰寫自己的Reducer與Action創造者。

## 本節程式碼

### index.js
```js
import { createStore } from 'redux'
import todoApp from './reducers'
const store = createStore(todoApp)
```