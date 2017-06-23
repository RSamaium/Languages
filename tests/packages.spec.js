const { expect } = require('chai');
var Languages = require('../src/languages')

describe('Open Languages JSON', function () {

  const fr_FR = require('../langs/fr_FR.json')
  const en_EN = require('../langs/en_EN.json')

  before(() => {
    Languages = Languages.instance();
    Languages.packages({ fr_FR, en_EN }).default('en_EN')
  })

  it('Hello', () => {
    expect('hello'.t()).to.equal('Hello');
  })

  it('Change Language --> fr_FR', () => {
    Languages.set('fr_FR');
    expect('hello'.t()).to.equal('Bonjour');
  })

});
