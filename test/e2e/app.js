/*global require,describe,it*/
var should = require('should');
var assert = require('assert');
var request = require('supertest');

describe('Rest API', function (){
    'use strict';
    describe ('Products',function () {
        it('should error trying to save product without ean13', function (){
            (true).should.be.exactly(false);
        });
    });
});