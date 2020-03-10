import expect from 'expect';
import React from 'react';
import {shallow,configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Counter from '../../src/components/counter';

function setup(counter=0){

    configure({adapter:new Adapter()});
        
    const actions={
        increment:expect.createSpy(),
        decrement:expect.createSpy()
    };

    const component=shallow(
        <Counter value={counter} {...actions}/>
    );

    return{
        component,
        actions,
        buttons:component.find('button'),
        p:component.find('p')
    };
};

export default setup;