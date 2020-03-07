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
  state => ({ value: state.Counter.present }),
  ActionCreators
)(Counter);
