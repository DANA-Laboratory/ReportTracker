const app = require('../');
const importer = require('../lib/models-sqlite3/importCSV');
const assert = require('assert');
const fs = require('fs');
const config = require('config');
const modelsSqlite3 = require('../lib/models-sqlite3');
const validator = require('../lib/models-sqlite3/validate');

describe('restful', function() {
    before(function (done) {
        var db = null;
        var importall = function(done) {
          var p1 = () => importer.importFromCSV(db, __dirname + '/csv/users.csv', (csvData) => validator.insert.validate(csvData, 'addUser'));
          var p2 = () => importer.importFromCSV(db, __dirname + '/csv/reportclass.csv', (csvData) => validator.insert.validate(csvData, 'addReportClass'));
          var p3 = () => importer.importFromCSV(db, __dirname + '/csv/variablecat1.csv', (csvData) => validator.insert.validate(csvData, 'addVariableCat_1'));
          var p4 = () => importer.importFromCSV(db, __dirname + '/csv/variablecat2.csv', (csvData) => validator.insert.validate(csvData, 'addVariableCat_2'));
          var p5 = () => importer.importFromCSV(db, __dirname + '/csv/variablecat3.csv', (csvData) => validator.insert.validate(csvData, 'addVariableCat_3'));
          var p6 = () => importer.importFromCSV(db, __dirname + '/csv/variables.csv', (csvData) => validator.insert.validate(csvData, 'addVariableDef'));
          var p7 = () => importer.importFromCSV(db, __dirname + '/csv/variables.csv', (csvData) => {
              csvData.reportclass_id = 'BSC';
              csvData.variabledef_id = csvData.caption;
              return validator.insert.validate(csvData, 'addReportClassVariable');
          });
          var p8 = () => importer.importFromCSV(db, __dirname + '/csv/variables.csv', (csvData) => {
              csvData.reportclass_id = 'BSC';
              csvData.variabledef_id = csvData.caption;
              csvData._verb = 'updateReportClassVariableSetCat_3';
              return validator.update.validate(db, csvData);
          });
          p1().then(p2).then(p3).then(p4).then(p5).then(p6).then(p7).then(p8).then(()=>done()).catch((err) => console.log(err));
        };
        this.timeout(20000);
        assert(config.get('dbPath'));
        if (fs.existsSync(config.get('dbPath'))) {
            modelsSqlite3.closedb().then(() => {
                fs.unlinkSync(config.get('dbPath'));
                modelsSqlite3.createDB(modelsSqlite3.ddl).then((db_) => {
                    assert(db_);
                    db = db_;
                    importall(done);
                }).catch((err)=>console.log(err));
            });
        } else {
            modelsSqlite3.createDB(modelsSqlite3.ddl).then((db_) => {
                assert(db_);
                db = db_;
                importall(done);
            }).catch((err)=>console.log(err));
        }
    });
    var agent = require('supertest').agent(app);
    beforeEach(function(done) {
        let data = {username : 'rafzalan', password : 'arg707'};
        agent
            .post('/auth/login')
            .type('form')
            .send(data)
            .expect(302)
            .expect('Location', '/')
            .end(function(err) {
                if (err) {
                  return done(err);
                }
                done();
            });
    });
    afterEach(function(done) {
        agent
            .get('/auth/logout')
            .expect(302)
            .expect('Location', '/')
            .end(function(err) {
                if (err) {
                  return done(err);
                }
                done();
            });
    });
    it('should get current user logs', function(done) {
        agent
            .get('/restful/Log')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(done);
    });
    it('should get current user', function(done) {
        agent
            .get('/restful/User')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(done);
    });
    it('should query ReportClass', function(done) {
        agent
            .get('/restful/ReportClass')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(done);
    });
    it('should get a ReportClass', function(done) {
        agent
            .get('/restful/ReportClass/1')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(done);
    });
    it('should query VariableCat_1', function(done) {
        agent
            .get('/restful/VariableCat_1')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(done);
    });
    it('should get a VariableCat_1', function(done) {
        agent
            .get('/restful/VariableCat_1/1')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(done);
    });
    it('should query VariableCat_2', function(done) {
        agent
            .get('/restful/VariableCat_2')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(done);
    });
    it('should query where VariableCat_2', function(done) {
        agent
            .get('/restful/VariableCat_2/variablecat_1_id/1')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(done);
    });
    it('should get a VariableCat_2', function(done) {
        agent
            .get('/restful/VariableCat_2/1')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(done);
    });
    it('should query VariableCat_3', function(done) {
        agent
            .get('/restful/VariableCat_3')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(done);
    });
    it('should query where VariableCat_3', function(done) {
        agent
            .get('/restful/VariableCat_3/variablecat_2_id/1')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(done);
    });
    it('should get a VariableCat_3', function(done) {
        agent
            .get('/restful/VariableCat_3/1')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(done);
    });
    it('should query VariableDef', function(done) {
        agent
            .get('/restful/VariableDef')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(done);
    });
    it('should get a VariableDef', function(done) {
        agent
            .get('/restful/VariableDef/1')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(done);
    });
    it('should insert new report', function(done) {
        agent
            .post('/restful/ReportClass')
            .send({caption: 'پیشرفت پروژه های عملیاتی', duration:'3M', User_owner: 1, caption_cat_1: 'منظر', caption_cat_2: 'هدف کلان', caption_cat_3: 'تمرکز استراتژیک', caption_variable:'پروژه عملیاتی'})
            .expect('Content-Type', /json/)
            .expect(200)
            .end(done);
    });
});
