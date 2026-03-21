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
