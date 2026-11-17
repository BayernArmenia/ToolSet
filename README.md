# TOOLSET

Одностраничная витрина ENAR без скролла: шапка с логотипом, анимированная сцена с товарами, футер в одну строку.
Стек: HTML + CSS + JavaScript, без сборки.

## Запуск локально

```bash
python -m http.server 5510
```

Откройте http://localhost:5510

## Что где

- `index.html` — разметка. Товары — блоки `<a class="slide">` (картинка, `data-title` по-армянски, `data-sub` по-английски, `href` — ссылка на ENAR).
- `assets/css/style.css` — стили и анимации. Время показа одного товара — `--slide`.
- `assets/js/main.js` — автосмена, прогресс, параллакс, свайп.
- `assets/img/products/` — фото товаров (webp с прозрачным фоном).

## TODO

- Логотип TOOLSET (сейчас текстовая заглушка в `<header>`).
- Адрес, телефон, Facebook и Instagram TOOLSET (сейчас временно стоят контакты BAYERN).
