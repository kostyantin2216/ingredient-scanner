const cheerio = require('cheerio');
const fetchPage = require('./fetch-page');

const BASE_URL = 'https://www.bbc.co.uk/food/ingredients/by/letter/';
const LETTERS = 'abcdefghijklmnopqrstuvwxyz'.split('');

function fetchIngredients(callback) {
    var allIngredients = [];
    var fetchesComplete = 0;
    
    LETTERS.forEach(function(letter) {
        var url = BASE_URL + letter;
        console.log(`fetching from ${ url }`);
        fetchPage(url, function(err, pageData) {
            console.log(`completed fetch from ${ url }`);
            if(err) {
                console.log(`ERROR: ${ err }`);
            } else {
                var parsedIngredients = parseIngredients(pageData);
                allIngredients.push(...parsedIngredients);
                console.log(`Found ${ parsedIngredients.length } ingredients for ${ letter }`);
            }
            
            fetchesComplete++;
            if(fetchesComplete === LETTERS.length) {
                callback(allIngredients);
            }
        });
    });
}

function parseIngredients(ingredientsPage) {
    $ = cheerio.load(ingredientsPage);

    var results = [];

    var itemElems = $('li', '.foods');
    itemElems.each(function(i, elem) {
        var text = $(this).children().first().text().trim();
        results.push(text);
    });

    return results;
}

module.exports = fetchIngredients;