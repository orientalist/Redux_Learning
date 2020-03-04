# Reducer

Reducer代表action傳遞至store後將如何修改state。記得action僅描述將發生什麼，但並不描述該如何發生。

## 設計state的形狀

在Redux中，所有的state都是以單一物件的形式儲存。在開始編碼前應該好好的思考它的形狀，該如何以最精簡的形狀設計你的state？

對於我們代辦事項的App，我們想要儲存兩件事：

1. 當前可見代辦事項的篩選條件。
2. 代辦事項。

你可能會發現你時常需要同時儲存UI與非UI資料，這當然可行，但最好嘗試著分開他們。

```js
{
  visibilityFilter: 'SHOW_ALL',
  todos: [
    {
      text: 'Consider using Redux',
      completed: true
    },
    {
      text: 'Keep all state in a single tree',
      completed: false
    }
  ]
}
```

> Note on Relationships
> 
> 在複雜的App中，不同的實體也許會彼此參考。我們建議你盡可能地正規化state，避免任何巢狀。所有的實體都是以ID作為Key的物件，並藉ID彼此參考。你可以將state是為資料庫。這將會在正規化章節仔細講解。例如將`todosById:{id->todo}`以及`todos:array<id>`保存在state中是較佳的做法。但下面的例子會簡單處理。
> 
## 控制Actions
現在我們決定了state的形狀，我們已準備好為他撰寫Reducer。Reducer是純函式，以前次State與Action為參數，並回傳下一個State。

```js
(previousState, action) => nextState
```

他被稱為Reducer是因為你可能會將他傳遞給陣列。`Array.prototype.reduce(reducer,?initialValue)`。保持單純對Reducer而言是很重要的，以下是你不應該在Reducer中做的：

- 使參數變異;

- 像呼叫API或路由過度產生副作用;

- 呼叫非純函式，如`Date.now()`或`Math.random()`

我們會在進階教程中解釋如何處理副作用。現在，請先記得Reducer必須純粹。給予相同的參數，Reducer必須運算並回傳下一個State。沒有驚喜、副作用。沒有呼叫API。沒有異變。只有運算。

藉由了解我們早先的Action逐步撰寫Reducer。

我們從指明初始State開始。Redux會在state為undefined時第一次調用Reducer。我們藉此回傳App初始的state：

```js
import { VisibilityFilters } from './actions'
const initialState = {
  visibilityFilter: VisibilityFilters.SHOW_ALL,
  todos: []
}
function todoApp(state, action) {
  if (typeof state === 'undefined') {
    return initialState
  }
  // For now, don't handle any actions
  // and just return the state given to us.
  return state
}
```

利用ES6預設參數使程式碼更為緊湊：

```js
function todoApp(state = initialState, action) {
  // For now, don't handle any actions
  // and just return the state given to us.
  return state
}
```

現在，控管`SET_VISIBILITY_FILTER`。需要做的只有改變state中visibilityFilter的值：

```js
import {
  SET_VISIBILITY_FILTER,
  VisibilityFilters
} from './actions'
...
function todoApp(state = initialState, action) {
  switch (action.type) {
    case SET_VISIBILITY_FILTER:
      return Object.assign({}, state, {
        visibilityFilter: action.filter
      })
    default:
      return state
  }
}
```

注意：

我們並未使state變異，而是`Object.assign()`。`Object.assign(state, { visibilityFilter: action.filter })`也是錯的：他仍會變異第一個參數。你必須以空物件為第一個參數。你也可以透過物件擴散運算元`{...state,...newState}`。

我們透過default回傳前一個state。這對未知的action十分重要。

> 筆記：Object.assign
> Object.assign來自是ES6，不支援舊的瀏覽器。為了支援，你需要使用`polyfill`，Babel外掛，或其他函式庫，例如`_.assign()`。


> 筆記：switch與Boilerplate
> switch並非樣板。Flux中，真正的樣板是概念：呼叫與更新的需求，將Dispatcher註冊給store的需求，物件化store的需求(以及當App擴充時代來的複雜度)。Redux藉由純函式而非事件發起者解決以上問題。
> 不幸的是，許多人仍為是否使用switch選擇框架。如果你不喜歡switch，你可以使用客製化的`createReducer`函式，接收`handler map`，如上述"reducing boilerplate"。

## 控制更多Actions
我們需要控管更多Actio！我們需要加入`ADD_TODO`與`TOGGLE_TODO`並擴充Reducer以控管他們。

```js
import {
  ADD_TODO,
  TOGGLE_TODO,
  SET_VISIBILITY_FILTER,
  VisibilityFilters
} from './actions'
...
function todoApp(state = initialState, action) {
  switch (action.type) {
    case SET_VISIBILITY_FILTER:
      return Object.assign({}, state, {
        visibilityFilter: action.filter
      })
    case ADD_TODO:
      return Object.assign({}, state, {
        todos: [
          ...state.todos,
          {
            text: action.text,
            completed: false
          }
        ]
      })
    default:
      return state
  }
}
```

如同以往，我們不直接修改state，而是回傳一個新物件。新的todo與舊的一樣在結尾時與新物件結合。更新後的todo使用來自action的資料組建而成。

最後，實作對`TOGGLE_TODO`的控制是意料中的：

```js
case TOGGLE_TODO:
  return Object.assign({}, state, {
    todos: state.todos.map((todo, index) => {
      if (index === action.index) {
        return Object.assign({}, todo, {
          completed: !todo.completed
        })
      }
      return todo
    })
  })
```

為了不變異原陣列而改變特定元素，我們需要複製一個一樣的陣列。如果你常撰寫類似的程式碼，你可以嘗試使用像`immutablity-helper`，`deeper`或像`Immutable`函式庫來達到深度更新。記住永不要更改state的內容。

## 分割Reducer
這是截至目前為止的程式碼：

```js
function todoApp(state = initialState, action) {
  switch (action.type) {
    case SET_VISIBILITY_FILTER:
      return Object.assign({}, state, {
        visibilityFilter: action.filter
      })
    case ADD_TODO:
      return Object.assign({}, state, {
        todos: [
          ...state.todos,
          {
            text: action.text,
            completed: false
          }
        ]
      })
    case TOGGLE_TODO:
      return Object.assign({}, state, {
        todos: state.todos.map((todo, index) => {
          if (index === action.index) {
            return Object.assign({}, todo, {
              completed: !todo.completed
            })
          }
          return todo
        })
      })
    default:
      return state
  }
}
```

是否有更好理解的方法？看來`todo`與`visibilityFilter`完全是獨立更新。有時候state欄位的值與其他狀況有所牽扯，但這裡我們可以將`todo`與`visibilityFilter`切分成獨立的函式：

```js
function todos(state = [], action) {
  switch (action.type) {
    case ADD_TODO:
      return [
        ...state,
        {
          text: action.text,
          completed: false
        }
      ]
    case TOGGLE_TODO:
      return state.map((todo, index) => {
        if (index === action.index) {
          return Object.assign({}, todo, {
            completed: !todo.completed
          })
        }
        return todo
      })
    default:
      return state
  }
}
function todoApp(state = initialState, action) {
  switch (action.type) {
    case SET_VISIBILITY_FILTER:
      return Object.assign({}, state, {
        visibilityFilter: action.filter
      })
    case ADD_TODO:
      return Object.assign({}, state, {
        todos: todos(state.todos, action)
      })
    case TOGGLE_TODO:
      return Object.assign({}, state, {
        todos: todos(state.todos, action)
      })
    default:
      return state
  }
}
```

注意todo接受的state是一個陣列！現在todoApp將一部分的state交給todo控管，而todo亦知道如何只調整該部分。這稱為reducer composition，而這是組成Resux的基本要素。

讓我們深入理解Reducer composition。我們是否亦能將`visibilityFilter`分離呢？是的，可以！

我們在import下加入ES6的物件解構賦值：

```js
const { SHOW_ALL } = VisibilityFilters
```

然後:

```js
function visibilityFilter(state = SHOW_ALL, action) {
  switch (action.type) {
    case SET_VISIBILITY_FILTER:
      return action.filter
    default:
      return state
  }
}
```

現在我們可以撰寫主Reducer，他透過調用部分Reducer控制他們，並把他們彙整為單一物件。主Reducer再也不需要知道初始的state狀態，而是當子Reducer接收到undefined時回傳初始值。

```js
function todos(state = [], action) {
  switch (action.type) {
    case ADD_TODO:
      return [
        ...state,
        {
          text: action.text,
          completed: false
        }
      ]
    case TOGGLE_TODO:
      return state.map((todo, index) => {
        if (index === action.index) {
          return Object.assign({}, todo, {
            completed: !todo.completed
          })
        }
        return todo
      })
    default:
      return state
  }
}
function visibilityFilter(state = SHOW_ALL, action) {
  switch (action.type) {
    case SET_VISIBILITY_FILTER:
      return action.filter
    default:
      return state
  }
}
function todoApp(state = {}, action) {
  return {
    visibilityFilter: visibilityFilter(state.visibilityFilter, action),
    todos: todos(state.todos, action)
  }
}
```

注意每個Reducer都掌控著部分全域state，參數也因各自管理不同部份而相異。

看起來很好了！當App擴張時，我們可以將Reducer拆散成小部分，各自獨立並控管不同部分。

最後，Redux提供了`combineReducers()`函式，與`todoApp`有著相同功能。我們可以藉此重構代碼：

```js
import { combineReducers } from 'redux'
const todoApp = combineReducers({
  visibilityFilter,
  todos
})
export default todoApp
```
注意，這與下面等價：

```js
export default function todoApp(state = {}, action) {
  return {
    visibilityFilter: visibilityFilter(state.visibilityFilter, action),
    todos: todos(state.todos, action)
  }
}
```

你也可以給這些函式各自的Key，並藉此呼叫他們：

```js
const reducer = combineReducers({
  a: doSomethingWithA,
  b: processB,
  c: c
})
function reducer(state = {}, action) {
  return {
    a: doSomethingWithA(state.a, action),
    b: processB(state.b, action),
    c: c(state.c, action)
  }
}
```

`combineReducers()`產生了一個函式，該函式可以透過你選擇的stete的key調用各自的Reducer，最終將他們合併為單一的物件。這不是魔術，並且與其他Reducer一樣，若`combineReducers()`下的state並未改變，他也不回產生新的state。

> 筆記：ES6技巧
> 由於`combineReducers()`需要一個物件最為參數，我們可以將所有上層Reducer分割進不同檔案，透過`import *`引入，並以他們各自的name作為物件的Key：

```js
import { combineReducers } from 'redux'
import * as reducers from './reducers'
const todoApp = combineReducers(reducers)
```

由於`import *`是相對較新的語法，我們不會在文件中使用它，但你可能仍會在社群中看到。

## 本節程式碼

### reducers.js
```js
import { combineReducers } from 'redux'
import {
  ADD_TODO,
  TOGGLE_TODO,
  SET_VISIBILITY_FILTER,
  VisibilityFilters
} from './actions'
const { SHOW_ALL } = VisibilityFilters
function visibilityFilter(state = SHOW_ALL, action) {
  switch (action.type) {
    case SET_VISIBILITY_FILTER:
      return action.filter
    default:
      return state
  }
}
function todos(state = [], action) {
  switch (action.type) {
    case ADD_TODO:
      return [
        ...state,
        {
          text: action.text,
          completed: false
        }
      ]
    case TOGGLE_TODO:
      return state.map((todo, index) => {
        if (index === action.index) {
          return Object.assign({}, todo, {
            completed: !todo.completed
          })
        }
        return todo
      })
    default:
      return state
  }
}
const todoApp = combineReducers({
  visibilityFilter,
  todos
})
export default todoApp
```