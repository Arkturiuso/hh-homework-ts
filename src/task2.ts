/* eslint-disable @typescript-eslint/no-unused-vars */
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
