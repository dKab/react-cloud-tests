const suites = require('./suites');
const acorn = require('acorn');
const parseFn = require('parse-function');

const app = parseFn();

exports.handler = async function (event) {
    const functionString = event.body;
    let fn;
    
    try {
        fn = app.parse(functionString, {
            parse: acorn.parse,
            ecmaVersion: 2017,
        });
    } catch (e) {
        return getResponse({
            status: 'Error',
            error: 'Function Parsing error',
        });
    }
    
    let func = new Function(fn.args, fn.body);
    
    const { suiteId } = event.queryStringParameters;
    const result = testFunction(func, suiteId);

    return getResponse(result);
};

function testFunction(fn, id) {
    const failed = [];
    const succeeded = [];
    const suite = getSuite(id);
    for( const t of suite.tests) {
        try {
            t.test(fn);
            succeeded.push({
                unit: suite.unit,
                test: t.text,
            });
        } catch(e) {
            // console.log(e);

            failed.push({
                unit: suite.unit,
                test: t.text
            });
        }
    }

    if (!failed.length) {
        succeeded.forEach(t => console.log(`- ${t.unit} ${t.test} (v)`));
    // console.log('OK!');
    } else {
    // console.log('There were error(s) in the following test(s): ');
        failed.forEach(t => console.log(`- ${t.unit} ${t.test} (x)`));
    }

    return {
        status: 'OK',
        result: failed.length ? 'Failed' : 'Passed',
        succeeded,
        failed
    };
}

function getSuite(id) {
    switch (id) {
        case 'sequencer': 
            return suites.sequencer;
        default:
            throw Error('unknown suite id');
    }
}

function getResponse(body) {
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json'
        },
        'isBase64Encoded': false,
        'body': body
    }
}

// describe("Функция sequence(startingValue, step)", function() {
// 	var startingValue = 10,
// 		step = 3;
// 	var generator = sequence(startingValue, step);
// 	it("должна возвращать другую функцию", function() {
// 		expect(generator).toBeOfType("Function");
// 		expect(generator).toEqual(jasmine.any(Function));
// 	});

// 	describe("Эта функция", function () {
// 		beforeEach(function() {
// 			generator = sequence(startingValue, step);
// 		});
// 		it('при первом вызове должна возвращать начальное значение', function () {
// 			expect(generator()).toEqual(startingValue);
// 		});
// 		it('при последующих вызовах должна возвращать значение, увеличенное на величину шага', function() {
// 			generator();
// 			expect(generator()).toEqual(startingValue+step);
// 			expect(generator()).toEqual(startingValue+step*2);
// 		});
// 	});
// 	describe("Её параметры", function () {
// 		var generator2;
// 		beforeEach(function() {
// 			generator2 = sequence();
// 		});

// 		it("должны быть необязательными", function() {
// 			expect(generator2).toBeTruthy();
// 		});
// 		it("начальное значение должно быть равно 0 по умолчанию", function() {
// 			expect(generator2()).toBe(0);
// 		});

// 		it("шаг должен быть равен 1 по умолчанию", function() {
// 			var g = sequence(4);
// 			expect(g()).toBe(4);
// 			expect(g()).toBe(5);
// 			expect(generator2()).toBe(0);
// 			expect(generator2()).toBe(1);
// 			expect(generator2()).toBe(2);
// 		});
// 	});
// 	it("можно создать любое количество независимых генераторов", function() {
// 		var generator = sequence(1, 5);
// 		var generator2 = sequence(1, 5);
// 		expect(generator).toBeTruthy();
// 		expect(generator2).toBeTruthy();
// 		expect(generator).not.toBe(generator2);
// 		generator();
// 		expect(generator()).not.toEqual(generator2());
// 	});
// });