import { assert } from 'chai';
import * as calculator from '../calculator.cjs';

describe('Calculator Tests', function() {

    describe('Addition Tests', function() {
        it('Should pass for add(5, 2)', function() {
            assert.equal(calculator.add(5, 2), 7);
        });

        it('Should fail for add(5, 2)', function() {
            assert.equal(calculator.add(5, 2), 8);
        });
    });

    describe('Subtraction Tests', function() {
        it('Should pass for sub(5, 2)', function() {
            assert.equal(calculator.sub(5, 2), 3);
        });

        it('Should fail for sub(5, 2)', function() {
            assert.equal(calculator.sub(5, 2), 5);
        });
    });

    describe('Multiplication Tests', function() {
        it('Should pass for mul(5, 2)', function() {
            assert.equal(calculator.mul(5, 2), 10);
        });

        it('Should fail for mul(5, 2)', function() {
            assert.equal(calculator.mul(5, 2), 12);
        });
    });

    describe('Division Tests', function() {
        it('Should pass for div(10, 2)', function() {
            assert.equal(calculator.div(10, 2), 5);
        });

        it('Should fail for div(10, 2)', function() {
            assert.equal(calculator.div(10, 2), 2);
        });

        it('Should throw error for div(5, 0)', function() {
            assert.throws(() => {
                div(5, 0);
            }, 'Cannot divide by zero');
        });
    });
});