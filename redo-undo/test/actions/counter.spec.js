import expect from 'expect';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as Actions from '../../src/actions/actions';
import setup from '../components/counter.spec';

//to set used middleware
const middlewares=[thunk];
//create store with middleware
const mockStore=configureStore(middlewares);

describe('actions',()=>{
    describe('counter',()=>{
        it('increment should create increment action by mock store',()=>{

            //the result action
            const expectedActions=[
                {type:Actions.INCREMENT_COUNTER}
            ];

            //set state of store
            const store=mockStore({counter:0});
            //fire action
            store.dispatch(Actions.increment());
            //expect(Actions.increment()).toEqual({type:Actions.INCREMENT_COUNTER});

            //get fired action of store
            expect(store.getActions()).toEqual(expectedActions);
        });

        it('decrement should create decrement action async',()=>{

            const expectedActions=[{
                type:Actions.DECREMENT_COUNTER
            }];

            const store=mockStore({counter:0});

            store.dispatch(Actions.decrement());

            setTimeout(()=>{
                expect(store.getActions()).toEqual(expectedActions);
            },1000);
            //expect(Actions.decrement()).toEqual({type:Actions.DECREMENT_COUNTER});
        });

        it('should display count',()=>{
            const {p}=setup();
            
            expect(p.text()).toMatch(/^Clicked: 0 times/);
        });
    });
});