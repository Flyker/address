const fetch = require("node-fetch")
const fs = require('fs');
//const iconv = require("iconv-lite");

//Content-Type: application/json; charset=windows-1251
fetch(`http://www.cikrf.ru/services/lk_tree/?id=${id}`, {})
        .then(
            function (response) {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' + response.status);
                    return null;
                }

                //const dest = fs.createWriteStream('./text.txt');
                //response.body.pipe(converterStream).pipe(dest);
                const converterStream = iconv.decodeStream('win1251');
                response.body.pipe(converterStream);
                converterStream.on('data', function (jsonStr) {
                    let data = JSON.parse(jsonStr);
                    console.log(data);
                    return data;
                });
            }
        )
        .catch(function (err) {
            console.log('Fetch Error :-S', err);
        });