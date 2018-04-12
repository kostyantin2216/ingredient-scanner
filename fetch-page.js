const axios = require('axios');

module.exports = function(url, callback) {
    axios.get(url)
    .then(function (response) {
        callback(null, response.data);
    })
    .catch(function (error) {
        callback(error);
    });
}