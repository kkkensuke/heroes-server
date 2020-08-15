const express = require('express'); // expressモジュールを読み込む
const bodyParser = require('body-parser');  // body-parserモジュールを読み込む 
const multer = require('multer'); // multerモジュールを読み込む

var HeroesModel = require('./model');

const app = express(); // expressアプリを生成する
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

/* DBに登録済
const heroes = [
    { id: 11, name: 'Dr Kensuke' },
    { id: 12, name: 'Bo' },
    { id: 13, name: 'Sonoking' },
    { id: 14, name: 'Mura God' },
    { id: 15, name: 'Tsukutsuku' },
    { id: 16, name: 'Satoshi' },
    { id: 17, name: 'Boss Suzuki' }
];
*/

// 新しいヒーローIDを作成.
function genId(){
    return new Promise(function (resolve, reject){
        HeroesModel.find().sort({id:-1}).limit(1).exec({}, function(err, heroes){
            if(err) return handleError(err);
            if(heroes.length>0) resolve(heroes[0].id + 1);
            else resolve(11);
        });
    });

    //return heroes.length > 0 ? Math.max(...heroes.map(hero => hero.id)) + 1 : 11;
}


// ヒーローのリストを取得
app.get('/heroes', (req, res) => {
    console.log('@@ get heroes');

    if(req.query.name)
    {
        // req.query.name を含むヒーローのリストを作成して返す.
        const query_name = req.query.name;

        HeroesModel.find( { "name" : new RegExp( ".*"+query_name+".*") } ).select('id name').exec({}, function(err, heroes){
            if(err) return handleError(err);
            res.json(heroes);
        });
    }else{
        HeroesModel.find().select('id name').exec({}, function(err, heroes){
            if(err) return handleError(err);
            res.json(heroes);
        });
    }

    /* DB接続前
    heroes.forEach(element => {
        var idx = element.name.indexOf(name);
        if(idx>=0)
            subheroes.push(element);
    });
    res.json(subheroes);
    */
});

// idを指定してヒーローを取得
app.get('/heroes/:id', (req, res) => {
    const query_id = req.params.id;
    console.log('@@ get heroes id:' + query_id);

    HeroesModel.find( { "id" : query_id } ).select('id name').exec({}, function(err, heroes){
        if(err) return handleError(err);
        if(heroes.length<=0)res.sendStatus(404);
        res.json(heroes[0]);
    });

    /* DB接続前のコード
    if(index >= 0) {
        const heroe = heroes[index];
        
        res.json(heroe);
    }else{
        res.sendStatus(404);
    }
    */

});


// 新しいヒーローを登録
app.post('/heroes', (req, res) => {
    const query_name = req.body.name;
    console.log('@@post heroes :' + query_name);

    genId().then(function(newId){
        console.log(newId);
        var heroes = new HeroesModel({
            id: newId,
            name: query_name
        });
        heroes.save(function(err){
            if(err) return handleError(err);
            // 追加した項目をクライアントに返す
            res.json(heroes);
        });
    }).catch(function (error) {
        // 非同期処理失敗。呼ばれない
        console.log('catch err :' );
        console.log(error);
    });
    
    /*
    const id = genId(heroes);
    const name = req.body.name;
    */
    /* DB接続前コード
    const newheroe = {
        id: id,
        name: name
    };
    heroes.push(newheroe);

    console.log('Add heroe: ' + JSON.stringify(newheroe));

    // 追加した項目をクライアントに返す
    res.json(newheroe);
    */

});


// ヒーロー削除
app.delete('/heroes/:id', (req, res) => {
    const query_id = req.params.id;
    console.log('@@delete heroes id:' + query_id);

    HeroesModel.remove( { "id" : query_id }, function(err){
        if(err) return handleError(err);
        // ステータスコード200:OKを送信
        res.sendStatus(200);
    });

    /* DB接続前コード
    if (index >= 0) {
        const deleted = heroes.splice(index, 1); // indexの位置にある項目を削除
        console.log('Delete: ' + JSON.stringify(deleted[0]));
        // ステータスコード200:OKを送信
        res.sendStatus(200);
    }
    */

});


// ヒーロー更新
app.put('/heroes', (req, res) => {
    // URLの:idと同じIDを持つ項目を検索
    const query_id = req.body.id;
    const query_name = req.body.name;
    console.log('@@put heroes / req.body:' + query_id);
    console.log('@@put heroes / req.body:' + query_name);

    HeroesModel.update( { "id" : query_id }, {$set: { name: query_name}} ).select('id name').exec({}, function(err){
        if(err) return handleError(err);
        // ステータスコード200:OKを送信
        res.sendStatus(200);
    });
    
    /* DB接続前コード
    //const index = heroes.findIndex((item) => item.id == req.body.id);
    if (index >= 0) {
        const hero = heroes[index];
        hero.name = req.body.name;
        console.log('Edit: ' + JSON.stringify(hero));
    }
    // ステータスコード200:OKを送信
    res.sendStatus(200);
    */

});

// ポート3000でサーバを立てる
app.listen(3000, () => console.log('Listening on port 3000'));