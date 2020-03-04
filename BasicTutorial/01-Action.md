# Action
第一步，建立一些action。

Action是由應用程式傳遞資訊至store的唯一載體，你可以透過`store.dispatch()`來傳遞資訊。

這是一個代表增加代辦事項的action：

```js
const ADD_TODO = 'ADD_TODO'
{
  type: ADD_TODO,
  text: 'Build my first Redux app'
}
```

Action是簡單的js物件，必須具有`type`屬性指出這個action該觸發何種動作。`Type`一般而言定義為string類型，當你的應用程式擴大後，你或許會希望將他們搬遷至分離的module中。

```js
import { ADD_TODO, REMOVE_TODO } from '../actionTypes'
```
> Note on Boilerplate
你不需要為了action的type在額外的檔案中定義常數，甚至不用定義他們。在小型專案中，使用string為type資料屬性相對簡單。然而在大型專案中明確定義type的常數將帶來好處。Read Reducing Boilerplate for more practical tips on keeping your codebase clean.
除了type，action的結構隨你而定。If you're interested, check out Flux Standard Action for recommendations on how actions could be constructed.
我們將加入更多的type值以描述一個用戶如何完成代辦事項。由於我們以陣列儲存待辦事項，藉由索引可以參考到特定的待辦事項。在真實的應用程式中，應該在新增時為資料產出唯一的ID。

```js
{
  type: TOGGLE_TODO,
  index: 5
}
```

盡量少地傳遞資料是理想的，例如只傳遞索引值而非整個物件。

最終，我們增加了一個action的type描述應該如何顯示待辦事項。

```js
{
  type: SET_VISIBILITY_FILTER,
  filter: SHOW_COMPLETED
}
```

## Action Creators

Action製造者，實際上是製造action的函式，action與action創造者容易混淆，你應該盡可能使用適當的模式。

在Redux中，action創造者單純地回傳一個action：

```js
function addTodo(text) {
  return {
    type: ADD_TODO,
    text
  }
}
```
這使得action得以復用與便於測試。

在傳統的Flux中，action創造者時常在被呼叫時觸發action，如下：

```js
function addTodoWithDispatch(text) {
  const action = {
    type: ADD_TODO,
    text
  }
  dispatch(action)
}
```

Redux不是如此運作而是將action創造者的回傳傳遞給`dispatch()`函式：

```js
dispatch(addTodo(text))
dispatch(completeTodo(index))
```

你也可以建立action與dispatch綁定的action創造者，他教自動調用dispatch函式：

```js
const boundAddTodo = text => dispatch(addTodo(text))
const boundCompleteTodo = index => dispatch(completeTodo(index))
```

現在你可以直接調用action了：

```js
boundAddTodo(text)
boundCompleteTodo(index)
```

你可以直接透過`store`調用dispatch()函式，如`store.dispatch()`，但更常透過`react-redux`的`connect()`調用。你可以透過`bindActionCreators()`函式自動將多個actiont創造者與dispatch()綁定。

Action創造者也可以是非同步且有副作用的。你可以再進階教程裡學習如何在ajax回應時將action創造者整合進非同步控制流。請不要跳過基礎教程，因為這包含非同步所需要的知識。

## Source Code
`actions.js`
```js
/*
 * action types
 */
export const ADD_TODO = 'ADD_TODO'
export const TOGGLE_TODO = 'TOGGLE_TODO'
export const SET_VISIBILITY_FILTER = 'SET_VISIBILITY_FILTER'
/*
 * other constants
 */
export const VisibilityFilters = {
  SHOW_ALL: 'SHOW_ALL',
  SHOW_COMPLETED: 'SHOW_COMPLETED',
  SHOW_ACTIVE: 'SHOW_ACTIVE'
}
/*
 * action creators
 */
export function addTodo(text) {
  return { type: ADD_TODO, text }
}
export function toggleTodo(index) {
  return { type: TOGGLE_TODO, index }
}
export function setVisibilityFilter(filter) {
  return { type: SET_VISIBILITY_FILTER, filter }
}
```