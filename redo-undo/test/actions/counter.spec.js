import expect from 'expect';
import * as Actions from '../../src/actions/actions';

describe('actions',()=>{
    describe('counter',()=>{
        it('increment should create increment action',()=>{
            expect(Actions.increment()).toEqual({type:Actions.INCREMENT_COUNTER});
        });
    });
});