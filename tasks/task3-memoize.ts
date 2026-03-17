/*
Задание 3: Реализуйте memoize для функций

Ограничения:
- Аргументы функции — только строки или числа (для упрощения)
- Кэшируйте результат по аргументам
*/
/**
 * @alias 
 */
type FuncArgs = number | string;
// Простое замыкание с логированием при повторном выражении
function memoize<T extends unknown[], R>(
    fn: (...args: T) => R): (...args: T) => R {
    // TODO: реализуйте
    const cache = new Map<string, R>();
    return function (this: void, ...args: T): R {
        const key = JSON.stringify(args);
        const value = cache.get(key);
        if(value !== undefined) {
            console.log("I've already seen this one");
            return value;
        }
        let result: R = fn.apply(this, args);
        cache.set(key, result);
        return result;
    };
}

// Используем type guards для проверки типов
const slowAdd = (a: FuncArgs, b: FuncArgs): FuncArgs => {
    if(typeof a === 'number' && typeof b === 'number') {
        return a + b;
    }
    return String(a) + String(b);
};

// Test case #1
const memoAddNumbers = memoize(slowAdd);
memoAddNumbers(1, 2); // возвращает 3
memoAddNumbers(1, 2); // из кэша, выводит сообщение о найденном выражении и возвращает 3

// Test case #2
const memoAddStrings = memoize(slowAdd);
memoAddStrings('Hello', 'world'); // возвращает Helloworld
memoAddStrings('Hello', 'world'); // из кэша, выводит сообщение о найденном выражении и возвращает Helloworld

// Test case #3
const obj = {
    value: 10,
    add(a: number) {
        return this.value + a;
    },
};

const memoAdd = memoize(obj.add.bind(obj));
console.log(memoAdd(5));

// Добавим возможность сортировки аргументов, если порядок не важен.
// Добавим возможность учитывать регистронезависимость
// посредством добавления опционального аргумента caseInsensitivity функции
// В целом, оптимизируем немного нашу функцию:
//     - Добавим возможность выбора регистронезависимости
//     - Сделаем сортировку
function improvedMemoize<T extends unknown[], R>(
    fn: (...args: T) => R, 
    sort: boolean = false, 
    caseInsensitivity: boolean = false): (...args: T) => R {

    const cache = new Map<string, R>();
    return function (this: void, ...args: T): R{
        // Регистронезависимость
        const normalized = args.map(
            (arg) => (caseInsensitivity && 
                typeof arg === 'string' ? arg.toLowerCase() : arg));

        // Сортировка
        if (sort) {
            normalized.sort();
        }
        const key = JSON.stringify(normalized);
        const value = cache.get(key);
        if (value !== undefined) {
            console.log("I've already seen this one");
            return value;
        }
        let result = fn.apply(this, args);
        cache.set(key, result);
        return result;
    };
}

// Test case #1
const improvedMemoAddNumbers = improvedMemoize(slowAdd, true);
improvedMemoAddNumbers(1, 2); // возвращает 3
improvedMemoAddNumbers(1, 2); // из кэша, выводит сообщение о найденном выражении и возвращает 3
improvedMemoAddNumbers(2, 1); // из кэша благодаря сортировке, возвращает 3

// Test case #2
const improvedMemoAddCaseStrings = improvedMemoize(slowAdd, false, true);
improvedMemoAddCaseStrings('Hello', 'world'); // возвращает Helloworld
improvedMemoAddCaseStrings('Hello', 'world'); // из кэша, выводит сообщение о найденном выражении и возвращает Helloworld
improvedMemoAddCaseStrings('hello', 'World'); // из кэша, выводит сообщение о найденном выражении и возвращает Helloworld
