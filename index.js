const axios = require('axios')
const fs = require('fs')
const iconv = require("iconv-lite")
const linq = require("linq")

//получение адреса для объекта id
async function GetAddress(id) {
    const response = await axios.get(`http://www.cikrf.ru/services/lk_tree/?id=${id}`, { responseType: 'arraybuffer', responseEncoding: 'binary' });
    let jsonStr = iconv.decode(Buffer.from(response.data), 'windows-1251');
    return JSON.parse(jsonStr);
}
//
//облаcти - 1й уровень
//города - 2й уровень
//улица - 7й уровень
//рекурсивный обход дерева
async function processTree(roots) {
    if (IsNeedExit) return;
    for (const item of roots) {
        if (item.a_attr.levelid) {            
            let levelid = +item.a_attr.levelid;
            if (levelid <= 8) {
                const addr = await GetAddress(item.id);
                addr.forEach(a => a.parent_id = item.id);
                tree = tree.concat(addr);
                console.log(tree.length);
                //
                await processTree(addr);
            }
        }
    }
}
//запись в файл    
function SaveFile(content) {
    fs.writeFile('./dist/addr.txt', content, (err) => {
        if (err) {
            console.error(err);
            return
        }
    })
}

//старт
let IsNeedExit = false;
let tree = [];
let roots = [];
//
(async () => {
    try {
        roots = await GetAddress(0);
        roots.forEach(a => a.parent_id = null);
        tree = [].concat(roots);
        //
        await processTree(roots);
    }
    catch(err) {}
    SaveFile(JSON.stringify(tree));
    console.log('end...');
    //
})()
