# 核心概念

想像您的App所擁有的state以下面的物件呈現，例如一個待辦事項App:

```js
{
  todos: [{
    text: 'Eat food',
    completed: true
  }, {
    text: 'Exercise',
    completed: false
  }],
  visibilityFilter: 'SHOW_COMPLETED'
}
```

這個物件如同一個沒有setter的"model",不同部分的程式碼無法任意地修改他,造成難以重現的bug。

為改變這個現狀,你需要調度一些`action`,一個`action`是一個簡單的js物件,描述發生了什麼事,如下例:

```js
{ type: 'ADD_TODO', text: 'Go to swimming pool' }
{ type: 'TOGGLE_TODO', index: 1 }
{ type: 'SET_VISIBILITY_FILTER', filter: 'SHOW_ALL' }
```

強制每個改變都描述為一個`action`可以讓我們清楚地了解App將發生什麼事。如果有地方變了,我們能追溯他的原因,為了將`state`與`action`連接,我們需要撰寫名為`reducer`的函式,不是神奇的魔術,只是一個接收`state`與`action`作為參數的函式，並回傳修改後的`state`。要為龐大的App撰寫reducer是困難的,所以我們以小型的reducer控管部分的state:

```js
function visibilityFilter(state = 'SHOW_ALL', action) {
  if (action.type === 'SET_VISIBILITY_FILTER') {
    return action.filter
  } else {
    return state
  }
}
function todos(state = [], action) {
  switch (action.type) {
    case 'ADD_TODO':
      return state.concat([{ text: action.text, completed: false }])
    case 'TOGGLE_TODO':
      return state.map((todo, index) =>
        action.index === index
          ? { text: todo.text, completed: !todo.completed }
          : todo
      )
    default:
      return state
  }
}
```

接著我們藉由呼叫上面兩個reducer撰寫控管所有state的reducer:

```js
function todoApp(state = {}, action) {
  return {
    todos: todos(state.todos, action),
    visibilityFilter: visibilityFilter(state.visibilityFilter, action)
  }
}
```

這就是Redux的基本觀念,請注意我們並未調用任何Redux的API,雖然Redux提供了一些工具以實現上述的模式,但最重要的是你如何描述action該如何變更你的state,90%的程式碼都是由javascript完成。