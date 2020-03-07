import * as Actions from "../actions/actions";

const counter = (state = 0, action) => {
  switch (action.type) {
    case Actions.INCREMENT_COUNTER:
      return (state += 1);
    case Actions.DECREMENT_COUNTER:
      return (state -= 1);
    default:
      return state;
  }
};

export default counter;