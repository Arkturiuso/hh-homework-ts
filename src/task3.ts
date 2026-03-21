/* eslint-disable @typescript-eslint/no-unused-vars */
// ====== Задание 3: Типизированный API-клиент =======
// 1. Модели Todo и User
interface Todo {
    id: number;
    title: string;
    completed: boolean;
    priority: number;
    createdAt: Date;
}

interface User {
    id: number;
    name: string;
    email: string;
}

// 2. Бренд-типы TodoId и UserId
type Brand<T, U> = T & { __brand: U };
type TodoId = Brand<number, 'todoId'>;
type UserId = Brand<number, 'userId'>;

// Функция создания бренда TodoId на основе данного числового аргумента
function createTodoId(todoId: number): TodoId {
    if (!Number.isInteger(todoId)) {
        throw new Error('Number must be an integer');
    }
    return todoId as TodoId;
}

// Функция создания бренда UserId на основе данного числового аргумента
function createUserId(userId: number): UserId {
    if (!Number.isInteger(userId)) {
        throw new Error('Number must be an integer');
    }
    return userId as UserId;
}

// Функции получения id пользователя и задачи
function getUserId(userId: UserId): number {
    return userId;
}

function getTodoId(todoId: TodoId): number {
    return todoId;
}

const firstTodoId = createTodoId(1);
const firstUserId = createUserId(1);

// Проверка работоспособности функций
getUserId(firstUserId);
getTodoId(firstTodoId);

// Тесты ниже вызовут ошибку компилятора
// getUserId(firstTodoId);
// getTodoId(firstUserId);

// 3. API-Ответ
// Перечисление для хранения статусов запроса
// disconnected нужно лишь для проверки, требуется раскомментировать для 4 пункта
enum Statuses {
    success = 'success',
    error = 'error',
    // disconnected = 'disconnected'
}

// Generic discriminated union с вариантами успеха и ошибки
// Раскомментирование строки в дженерике приведет к ошибке компилятора
type ApiResult<T> =
    | { status: Statuses.success; data: T }
    | { status: Statuses.error; message: string };
// | { status: Statuses.disconnected, reason: string}

// 4. Exhaustiveness генерик-функция handleResult
function handleResult<T>(result: ApiResult<T>): string {
    switch (result.status) {
        case Statuses.success:
            return JSON.stringify(result.data);
        case Statuses.error:
            return result.message;
        default: {
            const _exhaustiveCheck: never = result;
            return `Unexpected status: ${_exhaustiveCheck}`;
        }
    }
}

// 5. Массив приоритетов
const PRIORITIES = ['low', 'medium', 'high', 'critical'] as const;

// Вывод типа Priority
type Priority = (typeof PRIORITIES)[number];

// 6. Маппинг приоритетов на цвета
// Сначала создадим шаблон: приоритет: цвет
type PriorityColors = {
    [T in Priority]: string;
};

// Теперь создадим приоритеты на цвета
const PRIORITY_COLORS = {
    low: '#4caf50',
    medium: '#d0e643',
    high: '#cda128',
    critical: '#e32929',
} as const satisfies PriorityColors;

// 7. Утилити-типы
// Pick<> для TodoPreview
type TodoPreview = Pick<Todo, 'id' | 'title' | 'completed'>;

// Omit<> для TodoCreate
type TodoCreate = Omit<Todo, 'id' | 'createdAt'>;

// Readonly<> для ReadonlyTodo
type ReadonlyTodo = Readonly<Todo>;

// 8. Generic-функция apiRequest
// Простая реализация: если url не пустой, то успех, иначе - ошибка
function apiRequest<T>(url: string): ApiResult<T> {
    if (url.trim()) {
        return {
            status: Statuses.success,
            data: {} as T,
        };
    }
    return {
        status: Statuses.error,
        message: 'Url is not provided',
    };
}

// Test case #1
const successRequest = apiRequest('api/success');
console.warn(successRequest);
// Test return status: success

// Test case #2
const errorRequest = apiRequest('');
console.warn(errorRequest);
// Test return status: error

// 9. Overload-функция getTodos
// Создаем список задач на основе TodoPreview
const todoPreviewList: TodoPreview[] = [
    { id: 1, title: 'first', completed: true },
    { id: 2, title: 'second', completed: false },
    { id: 3, title: 'third', completed: true },
];

// Успешный ответ со списком задач
const resultPreviewList: ApiResult<TodoPreview[]> = {
    status: Statuses.success,
    data: todoPreviewList,
};

// Создаем список todos на основе интерфейса Todo
const todos: Todo[] = [
    {
        id: 1,
        title: 'first todo',
        completed: true,
        priority: 2,
        createdAt: new Date(),
    },
    {
        id: 2,
        title: 'second todo',
        completed: false,
        priority: 1,
        createdAt: new Date(),
    },
    {
        id: 3,
        title: 'third todo',
        completed: true,
        priority: 3,
        createdAt: new Date(),
    },
];

// Перегрузка без аргументов, возвращает список задач
function getTodos(): ApiResult<TodoPreview[]>;
// Перегрузка с аргументом id
function getTodos(id: TodoId): ApiResult<Todo>;

function getTodos(id?: TodoId): ApiResult<TodoPreview[]> | ApiResult<Todo> {
    if (id !== undefined) {
        const todo = todos.find((todo) => todo.id === id);
        if (todo) {
            return {
                status: Statuses.success,
                data: todo,
            };
        }
        return {
            status: Statuses.error,
            message: 'Todo with given id does not exist',
        };
    }
    return resultPreviewList;
}

// Вызов перегрузок
const todoPreviews = getTodos();
const firstTodo = getTodos(firstTodoId);

// Вывод результата вызова функций
console.warn(todoPreviews);
console.warn(firstTodo);
