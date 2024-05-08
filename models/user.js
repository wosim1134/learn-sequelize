const Sequelize = require('sequelize'); // Sequelize 패키지

// User 클래스를 정의> Sequelize.Model 상속
class User extends Sequelize.Model {
    // initiate 메서드 정의 -> Sequelize 인스턴스를 받아 모델을 초기화, 테이블에 대한 설정
    static initiate(sequelize) {
        // 모델의 스키마 정의
        User.init({
            // 테이블 칼럼 설정
            // 시퀄라이즈는 자동으로 id를 기본키로 연결-> 나머지 컬럼의 스펙만 입력
            // PostgreSQL 테이블과 컬럼 내용이 일치해야 정확하게 대응됨.
            name: {
                type: Sequelize.STRING(20), //
                allowNull: false, //
                unique: true, //
            },
            age: {
                type: Sequelize.INTEGER, //
                allowNull: false, //
                validate: {
                    min: 0 //
                },
            },
            married: { //
                type: Sequelize.BOOLEAN, //
                allowNull: false, //
            },
            comment: { //
                type: Sequelize.TEXT, //
                allowNull: false, //
            },
            created_at: { //
                type: Sequelize.DATE, //
                allowNull: false, //
                defaultValue: Sequelize.NOW, //
            },
        }, {
            //
            sequelize, //
            timestamps: false, //
                                //
            underscored: false,

            modelName: 'User', //
            tableName: 'users', //
            paranoid: false, //

            charset: 'utf8', //
            collate: 'utf8_general_ci', //
                                        //
                                        //
        });
    }
    //
    static associate(db) {
        db.User.hasMany(db.Comment, { foreignKey: 'commenter', sourceKey: 'id' });
        //
        //
        //
    }
};

module.exports = User; //