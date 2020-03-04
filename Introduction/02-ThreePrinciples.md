# 三大原則
Redux可以由三個基本原則描述：

## Single source of truth(單一資料源)

整個App的state儲存在單一`store`下的`object tree`。

不需花費額外的力氣便能將伺服器提供的資料融入客戶端,使建立複雜的App變得容易。單一狀態樹(Single state tree)使除錯與檢查程式碼變得容易;同時讓你能在快速開發時維持state,一些在過去十分複雜的功能,例如重做/回復亦變得容易。

```js
console.log(store.getState())
/* Prints
{
  visibilityFilter: 'SHOW_ALL',
  todos: [
    {
      text: 'Consider using Redux',
      completed: true,
    },
    {
      text: 'Keep all state in a single tree',
      completed: false
    }
  ]
}
*/
```
## State is read-only(State唯獨)

唯一變更state的方法為透過調用`action`,一個描述發生事件的物件。

這保證不論是對view的操控或回調函式,都不會直接修改state。相對的,他們只能表達對state修改的意圖,由於所有變更都是中心化並嚴格地逐一執行,對微妙變化的提防變得不重要,也由於action僅是簡單物件,他們得以被紀錄,序列化,儲存,用於在偵錯時重播或測試。

```js
store.dispatch({
  type: 'COMPLETE_TODO',
  index: 1
})
store.dispatch({
  type: 'SET_VISIBILITY_FILTER',
  filter: 'SHOW_COMPLETED'
})
```

## Changes are made with pure functions(透過純函式變更state)

為了指明state tree是如何被action改變的,你必須使用純函式是reducer。

Reducer只是接收前一次state與action的純函式(即不會修改前一次state),並回傳下階段的state,記住必須回傳下階段的state,而不是舊的state。你可以由單一reducer逐步擴增,將他們拆分成更小且可重複利用的reducer,每個reducer都控管著部分的state tree。由於reducer只是函式,你可以自由地控制執行順序、傳遞額外的參數,甚至製作可復用的reducer,如分頁功能。

```js
function visibilityFilter(state = 'SHOW_ALL', action) {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter
    default:
      return state
  }
}
function todos(state = [], action) {
  switch (action.type) {
    case 'ADD_TODO':
      return [
        ...state,
        {
          text: action.text,
          completed: false
        }
      ]
    case 'COMPLETE_TODO':
      return state.map((todo, index) => {
        if (index === action.index) {
          return Object.assign({}, todo, {
            completed: true
          })
        }
        return todo
      })
    default:
      return state
  }
}
import { combineReducers, createStore } from 'redux'
const reducer = combineReducers({ visibilityFilter, todos })
const store = createStore(reducer)
```

這就是全部了！