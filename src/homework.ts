/* eslint-disable @typescript-eslint/no-unused-vars */
// ====== Задание 1: Каталог фильмов =======

// 1. Интерфейс Movie с опциональными полями
interface Movie {
    id: number;
    title: string;
    year: number;
    rating: number;
    genre: unknown;
    description?: string;
    director?: string;
}

// 2. Создание массива readonly GENRES
// И вывод типа Genre
const GENRES = ['comedy', 'drama', 'action', 'horror', 'sci-fi'] as const;
type Genre = (typeof GENRES)[number];

// 3. Создание Union type 'SortBy'
type SortBy = 'year' | 'rating' | 'title';

// 4. Карточка и превью с помощью Utility types
// Используем Pick<T, 'key1' | 'key2' ... 'key(n)> для карточки
type MovieCard = Pick<Movie, 'id' | 'title' | 'year' | 'rating'>;

// Используем Readonly<T> для создания превьюшки с недоступными для перезначения полями
type MovieFull = Readonly<Movie>;

// 5. Функции 3 штуки
// Функция фильтрации по жанру фильма
function filterByGenre(movies: Movie[], genre: Genre): Movie[] {
    return movies.filter((movie) => movie.genre === genre);
}

// Функция сортировки фильмов по заданному свойству
// Тут я не понял, сортировка по возрастанию, убыванию или универсальная
// Поэтому, первым способом сделаю так, что будет функция для сортировки по возрастанию
// То есть, наша функция sortMovies, и отдельная функция для сортировки по убыванию sortMoviesDesc
function sortMovies(movies: Movie[], by: SortBy): Movie[] {
    return [...movies].sort((currentMovie, nextMovie) => {
        if (by === 'year' || by === 'rating') {
            return currentMovie[by] - nextMovie[by];
        }
        // Предполагаем, что SortBy не подвержен изменениям, поэтому не будем проверять отдельно title
        return currentMovie.title.localeCompare(nextMovie.title);
    });
}

function sortMoviesDesc(movies: Movie[], by: SortBy): Movie[] {
    return [...movies].sort((currentMovie, nextMovie) => {
        if (by === 'year' || by === 'rating') {
            return nextMovie[by] - currentMovie[by];
        }
        return nextMovie.title.localeCompare(currentMovie.title);
    });
}

// Второй способ - стандартная сортировка по опциональному аргументу функции
// Версия с опциональными аргументом sortOption, с помощью него можно выбрать направление сортировки
// Создадим перечисление наших сортировок, можно и тип, но скучно
enum SortOptions {
    Asc = 'asc',
    Desc = 'desc',
}

function sortMoviesModified(
    movies: Movie[],
    by: SortBy,
    sortOption: SortOptions = SortOptions.Asc
): Movie[] {
    return [...movies].sort((currentMovie, nextMovie) => {
        let sortedMovies;
        if (by === 'year' || by === 'rating') {
            sortedMovies = currentMovie[by] - nextMovie[by];
        } else {
            sortedMovies = currentMovie.title.localeCompare(nextMovie.title);
        }
        return sortOption === SortOptions.Asc ? sortedMovies : -sortedMovies;
    });
}

// Функция преобразования в карточку фильма
function toCard(movie: Movie): MovieCard {
    return {
        id: movie.id,
        title: movie.title,
        year: movie.year,
        rating: movie.rating,
    };
}

// 6. Маппинг жанров на emoji через Record<T, U>, основан на Mapped types
const emojisMap: Record<Genre, string> = {
    comedy: '😂',
    drama: '🥲',
    action: '💥',
    horror: '😱',
    'sci-fi': '👽',
};

type GENRE_EMOJI = typeof emojisMap;

// ====== Задание 2: Система уведомлений =======
// 1. Виды уведомлений: SuccessNotification, ErrorNotification, WarningNotification, InfoNotification
// У типа success есть свойство 'duration', измеряемое в секундах
// Сделаем так, чтобы оно могло быть только целым числом (чисто для практики)
// Сделаем бренд Integer, который должен быть числом и иметь свойство __brand со значением 'integer'
// Немного магии и выстрел в ногу обеспечен с помощью функции isInteger()
// Это чисто для практики, знаю что антипаттерн =)

type Integer = number & { __brand: 'integer' };

function isInteger(value: number): Integer {
    if (!Number.isInteger(value)) {
        throw new Error('Number must be an integer');
    }
    return value as Integer;
}

// тип Success
type SuccessNotification = {
    type: 'success';
    message: string;
    duration: Integer; // длительность в целых секундах
};

// тип Error
type ErrorNotification = {
    type: 'error';
    message: string;
    retry: boolean;
    errorCode: number;
};

// тип Warning
type WarningNotification = {
    type: 'warning';
    message: string;
};

// Доп. тип для проверки exhaustiveness check из 3 пункта
// type InfoNotification = {
//     type: 'info',
//     message: string,
//     details: string
// }

// Решил назвать наш union-тип AppNotification из-за конфликтов с DOM Notification
// Discriminated union AppNotification из типов Success, Error, Warning
type AppNotification =
    | SuccessNotification
    | ErrorNotification
    | WarningNotification;

// 2. Объект-маппинг. Для каждого типа уведомления своя иконка и цвет
// Получение всех видов уведомлений
type NotificationType = AppNotification['type'];

// Шаблон для описания свойств видам уведомлений
type NotificationConfig = {
    [T in NotificationType]: {
        icon: string;
        color: string;
    };
};

// Создание конфига с литералами на основе шаблона NotificationConfig
const NOTIFICATION_CONFIG = {
    success: { icon: '✅', color: '#4caf50' },
    error: { icon: '❌', color: '#ca2626' },
    warning: { icon: '⚠️', color: '#e39d33' },
} as const satisfies NotificationConfig;

// 3. Exhaustiveness
function renderNotification(n: AppNotification): string {
    switch (n.type) {
        case 'success':
            return n.message;
        case 'error':
            return n.message;
        case 'warning':
            return n.message;
        default: {
            const _exhaustiveCheck: never = n;
            return `Unexpected notification type: ${_exhaustiveCheck}`;
        }
    }
}

// 4. Type guard
function isErrorNotification(n: AppNotification): n is ErrorNotification {
    return n.type === 'error';
}

// Попытка создания ошибки типа ErrorNotification
const newError: ErrorNotification = {
    type: 'error',
    message: 'Not Found',
    retry: true,
    errorCode: 404,
};

// Проверка и вывод errorCode и retry
if (isErrorNotification(newError)) {
    console.warn(newError.errorCode);
    console.warn(newError.retry);
}

// 5. Utility types

// Только type и message из AppNotification через Pick<> утилити
type NotificationPreview = Pick<AppNotification, 'type' | 'message'>;

// ErrorNotification без errorCode через Omit<> утилити
type NotificationWithoutMeta = Omit<ErrorNotification, 'errorCode'>;

// 6. Intersaction с метаданными
type TrackedNotification = AppNotification & {
    id: number;
    createAt: Date;
    readAt?: Date;
};

// 7. Функция getUnread (остальные были написаны в ходе выполнения задания)
function getUnread(
    notifications: TrackedNotification[]
): TrackedNotification[] {
    return notifications.filter(
        (notification) => notification.readAt === undefined
    );
}

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
