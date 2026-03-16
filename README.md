# hh-homework-js

Четыре задания по JavaScript, переписанные на TypeScript, каждое в отдельном файле:

1. `task1-promise-all.js` — реализован свой `promiseAll`
2. `task2-delay.js` — реализован свой `delay(ms)`
3. `task3-memoize.js` — реализованы 2 варианта `memoize(fn)` (аргументы — строки/числа)
4. `task4-typed-object.js` — реализованы 2 варианта `typedObject(schema)`

Процесс:
- Устанавливаете зависимости через yarn install
- Можете форматировать все файлы .js командой yarn format-all
- Можете запустить команду yarn typecheck:tasks для проверки всех .ts файлов в папке tasks
- Второй способ проверки всех .ts файлов в папке tasks - yarn tsc --noEmit
- npx tsc для создания .js файлов и .map файлов в папке dist
- Закомментированные тесты можно проверить. Закомментировал, чтобы при запуске не было ошибок
