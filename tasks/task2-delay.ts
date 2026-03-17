/*
Задание 2: Реализуйте delay

Требования:
- delay(ms) возвращает промис
- Промис резолвится через ms миллисекунд
*/

// Простая реализация с проверкой ms
function delay(ms: number): Promise<void> {
    // TODO: реализуйте
    if(typeof ms !== 'number') {
        return Promise.reject('Invalid argument type: must be number');
    }
    if(ms < 0) {
        return Promise.reject('Invalid argument value');
    }

    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

// Test case #1
delay(500)
    .then(() => console.log('Готово через 500мс'))
    .catch(() => console.log('Не готово :('));
// Test status: success

// Test case #2
delay(-200)
    .then(() => console.log('Готово через -200мс'))
    .catch(() => console.log('Ошибка переданного значения'));
// Test status: given value error

// Тест ниже просто невыполним, Ts не позволит скомпилировать законным путем
// // Test case #3
// delay('hello')
//     .then(() => console.log('Выполнилось??'))
//     .catch(() => console.log('Ошибка переданного значения'));
// // Test status: given type error
