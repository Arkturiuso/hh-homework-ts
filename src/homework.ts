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
    error: { icon: '❌', color: '#f44336' },
    warning: { icon: '⚠️', color: '#ff9800' },
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
