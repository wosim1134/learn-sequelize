const express = require('express'); //
const path = require('path'); //
const morgan = require('morgan'); //
const nunjucks = require('nunjucks'); //

// models 폴더의 sequelize 객체 가져오기
const { sequelize } = require('./models');  // 폴더내의 index.js 파일은 require할 때 이름 생략 가능

const app = express(); //
app.set('port', process.env.PORT || 3001); //
app.set('view engine', 'html'); //

// nunjucks를 Express에 설정
nunjucks.configure('views', {
    express: app,  // Express 애플리케이션 지정
    watch: true, // 파일 변경을 감지하여 자동으로 템플릿 업데이트
})

// Sequelize를 사용하여 데이터베이스와 동기화
sequelize.sync({ force: false }) //
    .then(() => {
        console.log('데이터베이스 연결 성공'); // 동기화 성공 -> 콘솔에 메시지 출력
    })
    .catch((err) => {
        console.error(err); //동기화 중 오류 발생 -> 에러를 콘솔에 출력
    });

// 개발 환경에서 HTTP 요청 로깅 활성화
app.use(morgan('dev'));

// 정적 파일을 제공하기 위해 'public' 디렉토리 설정
app.use(express.static(path.join(__dirname, 'public')));

// JSON 형식 요청 본문 파싱을 위한 미들웨어 추가
app.use(express.json());

// URL-encoded 형식 요청 본문 파싱을 위한 미들웨어 추가
app.use(express.urlencoded({ extended: false }));

// 라우터가 없는 경우 404 에러를 발생시키는 미들웨어 추가
app.use((req, res, next) => {
    // 요청된 HTTP 메소드와 URL에 대한 에러 메시지 생성
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404; // 상태 코드를 404(Not Found)로 설정
    next(error); // 다음 미들웨어로 에러 객체를 전달
});

// 에러 핸들링을 위한 미들웨어 추가
app.use((err, req, res, next) => {
    res.locals.message = err.message; //
    // 개발 환경이 아닌 경우(production) 에러를 클라이언트에 노출하지 않음.
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
    res.status(err.status || 500); //
    res.render('error'); // 'error' 템플릿 렌더링 -> 클라이언트에 응답
});

// Express 애플리케이션을 특정 포트에서 실행
app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중');
});