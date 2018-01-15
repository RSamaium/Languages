const { expect } = require('chai');
var Languages = require('../src/languages')

describe('Open Languages JSON', function () {

    const en_EN =
        [
            {
                "hello": "hello world",
                "$you nb message": "{1} %d message%p",
                "$you": {
                    "you have": "you have"
                },
                "$you no message": "{1} no message"
            },
            {
                "plurial": {
                    "p": [
                        "s"
                    ]
                }
            }
        ]

    before(() => {
        Languages = Languages.instance();
        Languages.packages({ en_EN })
    })

    it('Hello', () => {
        expect('hello'.t()).to.equal('Hello world');
    })

    it('You have nb message', () => {
        expect('you have nb message'.t(5)).to.equal('You have 5 messages');
    })

    it('You have no message', () => {
        expect('you have no message'.t()).to.equal('You have no message');
    })

});
