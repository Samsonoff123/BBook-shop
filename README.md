## Описание проекта

Этот проект - интернет магазин по продаже книг. 
Целями для данного проекта были:
- Научиться создовать полноценные сайты с нуля
- Получить опыт в написании Backend на Node.js
- Получить опыт в формировании собственного API
- Научиться взаимодействовать с React и Redux в связке
- Улучшить свои навыки в написании Frontend части на React

Все поставленные цели считаю выполненными. Также во время написания проекта приходилось решать разные задачи связанные с веб разработкой. 

Например: 
- Загрузка данных при прокрутке страницы
- Добавление фотографий на сайт

Как итог, получился полноценный интернет магазин, в котором можно:
- Регистрироваться (при создании нового пользователя ему приходит письмо с его данными для авторизации) 
- Авторизироваться
- Восстанавливать пароль
- Менять данные о пользователе
- Оставлять отзывы о товарах
- Редактировать отзывы
- Покупать товары (процесc покупки реализован без привязки к платежным системам, но их также можно подключить)

Для магазина реализована админ панель с помощью которой возможно:
- Создавать новые товары
- Удалять товары
- Редактировать имеющиеся товары


## Использование

Для начала работы с приложением необходимо:
1. Клонировать репозиторий `git clone `
1. Уставновить все зависимости для сервера `npm install` 
1. Перейти в папку с клиентом `cd client`
1. Установить все зависимости для клиента `npm install`
1. Вернуться в корень проекта `cd ..`
1. Запустить сервер и клиент с помощью команда `npm run dev`

## Развертывание

Для использования магазина в production версии необходимо:
1. Выполнить команду `npm run client-build` для сборки клиента
1. Выполнить команду `npm start` для запуска сервера на Node.js (магазин будет рабоать на 81 порту)
