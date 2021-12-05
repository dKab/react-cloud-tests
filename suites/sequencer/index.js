var chai = require('chai');  
var expect = chai.expect;  

module.exports = {
    unit: 'Функция sequence',
    tests: [
        {
            text: 'должна возвращать другую функцию',
            test: (sequence) => {
                const sequencer = sequence();
                expect(sequencer).to.be.a('function');
            }
        },
        {
            text: 'должна возвращать функцию, которая при первом вызове должна возвращать начальное значение',
            test: (sequence) => {
                const sequencer = sequence(10);
                expect(sequencer()).to.equal(10);
            }
        },
        {
            text: 'должна возвращать функцию, которая при последующих вызовах возвращает значение, увеличенное на величину шага',
            test: (sequence) => {
                const sequencer = sequence(10, 3);
                sequencer();
                expect(sequencer()).to.equal(13);
                expect(sequencer()).to.equal(16);
                expect(sequencer()).to.equal(19);
                expect(sequencer()).to.equal(22);
            }
        },
        {
            text: 'должна поддерживать создание нескольких независимых экземпляров',
            test: (sequence) => {
                const sequencer1 = sequence(1, 5);
        		const sequencer2 = sequence(1, 5);
        		expect(sequencer1()).to.equal(1);
        		expect(sequencer2()).to.equal(1);
        		sequencer1();
                expect(sequencer1()).to.equal(11);
                expect(sequencer2()).to.equal(6);
            }
        }
    ]
}