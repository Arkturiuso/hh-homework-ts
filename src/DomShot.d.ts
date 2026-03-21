// Формат изображения
type ImageFormat = 'png' | 'jpeg' | 'webp';

// Смещение
interface Offset {
    x: number;
    y: number;
}

// Настройки
interface DomShotOptions {
    scale?: number;
    backgroundColor?: string | null;
    quality?: number;
    format?: ImageFormat;
    useCORS?: boolean;
    width?: number;
    height?: number;
    offset?: Offset;
    onClone?: (clonedElement: HTMLElement) => void;
}

// АPI
declare const DomShot: {
    // Захват
    // Тут я не увидел описания аргументов функции, поэтому пусть опции будут опциональным полем
    capture(element: HTMLElement, options?: DomShotOptions): Promise<string>;

    // Загрузка
    download(
        element: HTMLElement,
        filename: string,
        options?: DomShotOptions
    ): Promise<void>;

    // Получение поддерживаемых форматов изображения
    getSupportedFormats(): ImageFormat[];

    version: string;
};

export default DomShot;
