const express = require('express'); // Express 모듈
const path = require('path'); // 
const morgan = require('morgan'); //
const nunjucks = require('nunjucks'); //

// models 폴더의 sequelize 객체 가져오기
const { sequelize } = require('./model'); // 폴더내의 index.js 파일은 require할 때 이름 생략 가능

const app = express(); //
app.set('port', process.env.PORT || 3001); //
app.set('view engine', 'html'); //

// nunjucks Express에 설정
nunjucks.configure('views', {
    express: app, //
    watch: true, // 파일 변경을 감지하여 자동으로 템플릿 업데이트
})

//
sequelize.sync({ force: false }) //
    .then(() => {
        console.log('데이스베이스 연결 성공'); //
    })
    .catch((err) => {
        console.error(err); //
    });

//
app.use(morgan('dav'));

//
app.use(express.static(path.join(__dirname, 'public')));

//
app.use(express.json());

//
app.use(express.urlencoded({ extended: false }));

// 라우터가
app.use((req, res, next) => {
    //
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다`);
    error.status = 404; //
    next(error); //
});

//
app.use((err, req, res, next) => {
    res.locals.message = err.message; //
    //
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
    res.status(err.status || 500); //
    res.render('error'); //
});

//
app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중');
});