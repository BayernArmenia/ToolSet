# TOOLSET

**Сайт:** https://bayernarmenia.github.io/ToolSet/ (английская версия — https://bayernarmenia.github.io/ToolSet/?lang=en)

Публикуется через GitHub Pages из ветки `main` (корень репозитория): после push обновляется примерно за минуту.

Одностраничная витрина ENAR без скролла: шапка с логотипом, анимированная сцена с товарами, футер в одну строку.
Стек: HTML + CSS + JavaScript, без сборки.

## Запуск локально

```bash
python -m http.server 5510
```

Откройте http://localhost:5510

## Что где

- `index.html` — разметка. Товары — блоки `<a class="slide">`: картинка, `data-key`, `href` — страница модели на enargroup.com.
  Модели: ZEN-L, REN 655, i-SPYDER, DINGO, TORNADO, TIFON 900.
- Языки: грузинский (по умолчанию) и английский. Все тексты — в словаре `I18N` в начале `assets/js/main.js`.
  Выбор языка запоминается; ссылка на английскую версию — `?lang=en`.
- `assets/css/style.css` — стили и анимации. Время показа одного товара — `--slide`.
- `assets/js/main.js` — автосмена, прогресс, параллакс, свайп.
- `assets/img/products/` — фото моделей (webp, прозрачный фон). Исходники с enargroup.com — в `media/`.
- `assets/img/logo.svg` — логотип для тёмного фона, `logo-dark.svg` — для светлого. Векторизованы из `media/` (JPEG).

## TODO

- Вычитать грузинские названия товаров носителем языка.
