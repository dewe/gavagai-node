'use strict';

var should = require('should');
var nock = require('nock');
var gavagai = require('../lib');

describe('The gavagai API stories resource', function () {
    var texts = require('./data/texts.json');
    var client = gavagai('abc123');
    var api;

    it('should have default language', function(done) {
        validateApiRequest(function(body) {
            var defaultLanguage = 'en';
            body.language.should.equal(defaultLanguage);
            return requiredValues(body);
        });
        client.stories(texts, function (err, data) {
            api.isDone().should.equal(true, "Matching API call.");
            done();
        });
    });

    it('should accept an array of document objects', function (done) {
        validateApiRequest(requiredValues);
        client.stories(texts, function (err, data) {
            api.isDone().should.equal(true, "Matching API call.");
            done();
        });
    });

    it('should accept an array of strings', function (done) {
        validateApiRequest(requiredValues);
        client.stories(['this is a text', 'this is text 2', 'this is a third text'], function () {
            api.isDone().should.equal(true, "Matching API call.");
            done();
        })
    });

    it('should handle custom options', function (done) {
        var options = {
            language: 'sv',
            terms: ['term', 'term phrase']
        };

        validateApiRequest(function(body) {
            body.language.should.equal('sv');
            body.terms.should.eql(['term', 'term phrase'], 'parameter "terms"');
            return requiredValues(body);
        });

        client.stories(texts, options, function () {
            api.isDone().should.equal(true, "Matching API call.");
            done();
        });
    });

    it('should return a promise');

    function validateApiRequest(validator) {
        api = nock('https://api.gavagai.se:443')
            .filteringPath(/language=[^&]*/g, 'language=XX')
            // TODO: remove detailed and language from url
            .post('/v3/stories?detailed=true&language=XX&apiKey=abc123', validator)
            .reply(200, {});
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

