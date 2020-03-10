import React from 'react';

const Counter=state=>{
    return(
        <p>
            Clicked: {state.value} times
            <button onClick={state.increment()}>+</button>
            <button onClick={state.decrement()}>-</button>
        </p>
    );
};

export default Counter;