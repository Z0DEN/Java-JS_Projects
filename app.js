const axios = require('axios'); // Подключение модуля axios для скачивания страницы
const fs = require('fs'); // Подключение встроенного в Node.js модуля fs для работы с файловой системой
const jsdom = require("jsdom"); // Подключение модуля jsdom для работы с DOM-деревом (1)
const { JSDOM } = jsdom; // Подключение модуля jsdom для работы с DOM-деревом (2)

const pagesNumber = 162; // Количество страниц со статьями на сайте журнала на текущий день. На каждой странице до 18 статей
const baseLink = 'https://jrnlst.ru/?page='; // Типовая ссылка на страницу со статьями (без номера в конце)
var page = 0; // Номер первой страницы для старта перехода по страницам с помощью пагинатора
var parsingTimeout = 0; // Стартовое значение задержки следующего запроса (увеличивается с каждым запросом, чтобы не отправлять их слишком часто)

function paginator() {
         var link = baseLink + page; // Конструктор ссылки на страницу со статьями для запроса по ней
         console.log('Запрос статей по ссылке: ' + link); // Уведомление о получившейся ссылке
         // Запрос к странице сайта
         axios.get(link)
            .then(response => {
               var currentPage = response.data; // Запись полученного результата
               const dom = new JSDOM(currentPage); // Инициализация библиотеки jsdom для разбора полученных HTML-данных, как в браузере
               // Определение количества ссылок на странице, потому что оно у них не всегда фиксированное. Это значение понадобится в цикле ниже
               var linksLength = dom.window.document.getElementById('block-views-articles-latest-on-front-block').getElementsByClassName('view-content')[0].getElementsByClassName('flex-teaser-square').length;
               // Перебор и запись всех статей на выбранной странице
               for (i = 0; i < linksLength; i++) {
                  // Получение относительных ссылок на статьи (так в оригинале)
                  var relLink = dom.window.document.getElementById('block-views-articles-latest-on-front-block').getElementsByClassName('view-content')[0].getElementsByClassName('flex-teaser-square')[i].getElementsByClassName('views-field views-field-title')[0].getElementsByTagName('a')[0].outerHTML;
                  // Превращение ссылок в абсолютные               
                  var article = relLink.replace('/', 'https://jrnlst.ru/') + '<br>' + '\n';
                  // Уведомление о найденных статьях
                  console.log('На странице ' + 'найдена статья: ' + article);      
                  // Запись результата в файл
                  fs.appendFileSync('C:/Users/user_10/GitHub/cloudblesk.site/www/Wallpapers/articles.html', article, (err) => {
                     if (err) throw err;
                  });
               };
               if (page > pagesNumber) {
                  console.log('Парсинг завершён.')}; // Уведомление об окончании работы парсера
            });
         page++; // Увеличение номера страницы для сбора данных, чтобы следующий запрос был на более старую страницу
   };
paginator(); // Запуск перехода по страницам и сбора статей