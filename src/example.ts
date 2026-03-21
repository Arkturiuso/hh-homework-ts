import DomShot from './DomShot';

// 1. DomShot.capture(el) — возвращает Promise<string>
const el = document.body;
const promise = DomShot.capture(el);
console.warn(typeof promise);

// 2. DomShot.capture(el, { scale: "two" }) — ошибка компиляции
// Раскомментирование вызовет ошибку компилятора
// const promise_2 = DomShot.capture(el, { scale: "two" });

// 3. DomShot.capture(el, { format: "bmp" }) — ошибка компиляции ("bmp" не входит в ImageFormat)
// Раскомментирование вызовет ошибку компилятора
// const promise_3 = DomShot.capture(el, { format: "bmp" });

// 4. DomShot.capture("not element") — ошибка компиляции
// const promise_4 = DomShot.capture("not element");

// 5. DomShot.download(el, "screenshot") — возвращает Promise<void>
const promise_5 = DomShot.download(el, 'screenshot');
console.warn(typeof promise_5);

// 6. DomShot.version — тип string
const version = DomShot.version;
console.warn(typeof version);
