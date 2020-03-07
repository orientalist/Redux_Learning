## 學習redo與undo

1. 安裝`redux-undo`
```shell
npm install redux-undo
```

2. 在`combineReducers`內設定使用
```js
import { combineReducers } from "redux";
import undoable, { includeAction } from "redux-undo";
import Counter from "./counter";
//引入actions(字串)
import {
  INCREMENT_COUNTER,
  DECREMENT_COUNTER,
  UNDO_COUNTER,
  REDO_COUNTER
} from "../actions/actions";

const rootReducer = combineReducers({
  //undoable是高級函式,將傳入的Reducer升級可使用redo/undo
  Counter: undoable(Counter, {
    //filter值為可使用redo/undo的action
    filter: includeAction([INCREMENT_COUNTER, DECREMENT_COUNTER]),
    //limit為redo/undo可用次數
    limit: 10,
    debug: true,
    //undo與redo使用的action
    undoType: UNDO_COUNTER,
    redoType: REDO_COUNTER
  })
});

export default rootReducer;
```

3. 在`container`中取用`rootReducer`
```js
import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import * as ActionCreators from "../actions/actions";

function Counter({ increment, decrement, undo, redo, value }) {
  return (
    <p>
      Clicked: {value} times
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={undo}>Undo</button>
      <button onClick={redo}>Redo</button>
    </p>
  );
}

Counter.propTypes = {
  increment: PropTypes.func.isRequired,
  decrement: PropTypes.func.isRequired,
  undo: PropTypes.func.isRequired,
  redo: PropTypes.func.isRequired,
  value: PropTypes.number.isRequired
};

export default connect(
  //注意,因為使用了undoable,取值需要用.present
  state => ({ value: state.Counter.present }),
  ActionCreators
)(Counter);

```