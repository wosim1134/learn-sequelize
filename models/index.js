// Sequelize 패키지 > Sequelize 객체를 생성하고 PostgreSQL과의 연결을 관리
const Sequelize = require('sequelize');
const User = require('./user'); //
const Comment = require('./comment'); //

// 환경 변수에서 현재 환경을 가져오거나 기본값으로 'development'를 사용
const env = process.env.NODE_ENV || 'development';

// 설정 파일에서 현재 환경에 해당하는 설정을 가져오기
const config = require('../config/config.json')[env];

const db = {}; // 데이터베이스 객체 저장용 빈 객체 생성

// Sequelize 객체 생성 -> PostgreSQL과의 연결을 관리
// 설정 파일에서 가져온 데이터베이스 이름, 사용자 이름, 비밀번호 및 기타 연결 옵션을 사용하여 연결 설정
const sequelize = new Sequelize(config.database, config.username, config.password, config);


// 데이터베이스 객체에 Sequelize 연결 객체 추가 -> 모델을 정의하고 사용할 때 이 연결 객체를 사용
db.sequelize = sequelize;

db.User = User;
db.Comment = Comment;

//
User.initiate(sequelize);
Comment.initiate(sequelize);

User.associate(db);
Comment.associate(db);

// 데이터베이스 객체를 내보냄 -> 이 모듈을 다른 파일에서 가져와 데이터베이스 연결을 사용할 수 있음.
module.exports = db;