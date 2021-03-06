/**
 * Created by Alec on 11/5/2014.
 * Source: http://webapplog.com/express-js-4-node-js-and-mongodb-rest-api-tutorial/
 */
var superagent = require('superagent'); //a small progressive client-side HTTP request library
var expect = require('expect.js'); //Minimalistic BDD assertion toolkit based on should.js

describe('express rest api server', function(){
    var id;

    it('should post object', function(done){
        superagent.post('http://localhost:3000/db/test')
            .send({ name: 'John'
                , email: 'john@rpjs.co'
            })
            .end(function(e,res){
                // console.log(res.body)
                expect(e).to.eql(null);
                expect(res.body.length).to.eql(1);
                expect(res.body[0]._id.length).to.eql(24);
                id = res.body[0]._id;
                done()
            })
    });

    it('should retrieve an object', function(done){
        superagent.get('http://localhost:3000/db/test/'+id)
            .end(function(e, res){
                // console.log(res.body)
                expect(e).to.eql(null);
                expect(typeof res.body).to.eql('object');
                expect(res.body._id.length).to.eql(24);
                expect(res.body._id).to.eql(id);
                done()
            })
    });

    it('should retrieve a collection', function(done){
        superagent.get('http://localhost:3000/db/test')
            .end(function(e, res){
                // console.log(res.body)
                expect(e).to.eql(null);
                expect(res.body.length).to.be.above(0);
                expect(res.body.map(function (item){return item._id})).to.contain(id);
                done()
            })
    });

    it('should update an object', function(done){
        superagent.put('http://localhost:3000/db/test/'+id)
            .send({name: 'Peter'
                , email: 'peter@yahoo.com'})
            .end(function(e, res){
                // console.log(res.body)
                expect(e).to.eql(null);
                expect(typeof res.body).to.eql('object');
                expect(res.body.msg).to.eql('success');
                done()
            })
    });
    it('should check an updated object', function(done){
        superagent.get('http://localhost:3000/db/test/'+id)
            .end(function(e, res){
                // console.log(res.body)
                expect(e).to.eql(null);
                expect(typeof res.body).to.eql('object');
                expect(res.body._id.length).to.eql(24);
                expect(res.body._id).to.eql(id);
                expect(res.body.name).to.eql('Peter');
                done()
            })
    });

    it('should remove an object', function(done){
        superagent.del('http://localhost:3000/db/test/'+id)
            .end(function(e, res){
                // console.log(res.body)
                expect(e).to.eql(null);
                expect(typeof res.body).to.eql('object');
                expect(res.body.msg).to.eql('success');
                done()
            })
    })
});