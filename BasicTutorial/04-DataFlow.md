## 資料流

Redux架構下的資料流為嚴格單向。

這意味所有應用程式都遵守的相同的生命週期模型，這使你的程式更具可預測性與更好理解。我們也鼓勵正常化資料，所以你最終不會製造出互不相知，相同卻獨立的資料。

若你尚未被說服，閱讀`Motivation`與`The Case for Flux`理解更多單向資料流。雖然Redux不完全相同於Flux，但他們分享相同的好處。

所有Redux的生命週期為以下四步驟：

1. 呼叫`store.dispatch(action).`

一個Action是一個簡單物件，描述發生什麼事。例如：

```js
{ type: 'LIKE_ARTICLE', articleId: 42 }
{ type: 'FETCH_USER_SUCCESS', response: { id: 3, name: 'Mary' } }
{ type: 'ADD_TODO', text: 'Read the Redux docs.' }
```

將action想像為現狀的簡單片段。"瑪麗喜歡42號文章"或“閱讀Redux文章”被加入`todos`的清單中。

你可以在程式任何地方調用`store.dispatch(action)`，包含元件與XHR回調函式，甚至在定時排程中。

2. Redux的Store會調用你提供的Reducer函式。

Store會傳遞兩個參數給Reducer：當前state樹與action。例如這個App的根Reducer或許接收資料如下：

```js
// The current application state (list of todos and chosen filter)
let previousState = {
  visibleTodoFilter: 'SHOW_ALL',
  todos: [
    {
      text: 'Read the docs.',
      complete: false
    }
  ]
}
// The action being performed (adding a todo)
let action = {
  type: 'ADD_TODO',
  text: 'Understand the flow.'
}
// Your reducer returns the next application state
let nextState = todoApp(previousState, action)
```

注意：Reducer是純函式。他只產生下一個state。他應該是完全可預測的：傳遞相同的參數不論幾次都應回傳相同的結果，不應該如同呼叫API或路由變化產生副作用。這些都應該在Action傳遞結束前完成。

3. 根Reducer會合併多個Reducer結果為單一的state樹。

如何架構根Reducer取決於你。`combineReducer()`函式協助Redux，將根Reducer分割成各自控管自己state的函式。

以下是`combineReducers()`如何運作。我們有兩個Reducer，一個是管理todos清單，一個控管如何顯示：

```js
function todos(state = [], action) {
  // Somehow calculate it...
  return nextState
}
function visibleTodoFilter(state = 'SHOW_ALL', action) {
  // Somehow calculate it...
  return nextState
}
let todoApp = combineReducers({
  todos,
  visibleTodoFilter
})
```

當你發起Action時，`combineReducers`回傳的`todoApp`函式會調用兩個Reducer：

```js
let nextTodos = todos(state.todos, action)
let nextVisibleTodoFilter = visibleTodoFilter(state.visibleTodoFilter, action)
```

並且將兩個Reducer函式回傳的state合併為一：

```js
return {
  todos: nextTodos,
  visibleTodoFilter: nextVisibleTodoFilter
}
```

雖然`combineReducer()`很方便，但也未必一定要使用，你可以自己撰寫根Reducer！

4. Redux會儲存根Reducer回傳的完整state樹。

新的state樹是下階段的state！透過`store.subscribe(listener)`註冊的監聽器現在會在action被調用時觸發，你可以透過`store.getState()`取得現在的state樹。

現在可以透過新state更新UI。如果你使用React Redux，`component.setState(newState)`可以調用。

> 筆記：給進階用戶
> 如果你以熟悉基本用法，請閱讀非同步資料流，學習中間件如何改變非同步action在接觸Reducer前。