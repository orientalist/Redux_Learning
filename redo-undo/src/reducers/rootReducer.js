import { combineReducers } from "redux";
import undoable, { includeAction } from "redux-undo";
import Counter from "./counter";
import {
  INCREMENT_COUNTER,
  DECREMENT_COUNTER,
  UNDO_COUNTER,
  REDO_COUNTER
} from "../actions/actions";

const rootReducer = combineReducers({
  Counter: undoable(Counter, {
    filter: includeAction([INCREMENT_COUNTER, DECREMENT_COUNTER]),
    limit: 10,
    debug: true,
    undoType: UNDO_COUNTER,
    redoType: REDO_COUNTER
  })
});

export default rootReducer;
