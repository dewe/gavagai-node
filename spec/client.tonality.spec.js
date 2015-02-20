'use strict';

var should = require('should');
var nock = require('nock');
var gavagai = require('../lib');

describe('The gavagai API tonality resource', function () {
    var texts = require('./data/texts.json');
    var client = gavagai('abc123');
    var api;

    it('should have default language', function (done) {
        validateApiRequest(function (body) {
            var defaultLanguage = 'en';
            body.language.should.equal(defaultLanguage);
            return requiredValues(body);
        });
        client.tonality(texts, function (err, data) {
            api.isDone().should.equal(true, "Matching API call.");
            done();
        });
    });

    it('should accept an array of text objects', function (done) {
        validateApiRequest(requiredValues);
        client.tonality(texts, function (err, data) {
            api.isDone().should.equal(true, "Matching API call.");
            done();
        });
    });

    it('should accept an array of strings', function (done) {
        validateApiRequest(requiredValues);
        client.tonality(['this is a text', 'this is text 2', 'this is a third text'], function () {
            api.isDone().should.equal(true, "Matching API call.");
            done();
        })
    });

    it('should accept a single string', function (done) {
        validateApiRequest(requiredValues);
        client.tonality('this is a text', function () {
            api.isDone().should.equal(true, "Matching API call.");
            done();
        })
    });

    it('should handle custom options', function (done) {
        var options = {
            language: 'sv',
            terms: ['term', 'term phrase']
        };

        validateApiRequest(function (body) {
            body.language.should.equal('sv');
            body.terms.should.eql(['term', 'term phrase'], 'parameter "terms"');
            return requiredValues(body);
        });

        client.tonality(texts, options, function () {
            api.isDone().should.equal(true, "Matching API call.");
            done();
        });
    });

    describe('fromTopics method', function () {
        var topics = require('./data/topics.json');

        it('should transform N topics output into a tonality call with N texts.', function (done) {
            validateApiRequest(function (body) {
                requiredValues(body);
                body.documents.length.should.equal(topics.topics.length);
                return true;
            });

            client.tonality.fromTopics(topics, function (err, data) {
                api.isDone().should.equal(true, "Matching API call.");
                done();
            });
        });
    });

    function validateApiRequest(validator) {
        api = nock('https://api.gavagai.se:443')
            .post('/v3/tonality?apiKey=abc123', validator)
            .reply(200, 'OK');
    }

    function requiredValues(body) {
        body.should.have.property('documents');
        body.documents.should.be.an.Array;
        body.documents[0].should.have.properties('id', 'body');
        return true;
    }

    afterEach(function () {
        nock.cleanAll();
    })
});

