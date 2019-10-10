const {expect} = require('chai');
var Languages = require('../src/languages')

describe('Test Sync Language', function() {

  function its() {
    it('Hello', () => {
      expect('hello'.t()).to.equal('Hello');
    })

    it('Local Language', () => {
      expect('hello'.t('fr_FR')).to.equal('Bonjour');
    })
  }

  before(() => {
      const instance = Languages.instance();
      instance.init(['en_EN', 'fr_FR'], `${__dirname}/../langs/`);
  })

  its()

  describe('Test async All Language', function() {

    before(done => {
      const instance = Languages.instance();
      instance.all(`${__dirname}/../langs/`, done);
    })

    its()

  });

  describe('Test Sync All Language', function() {

    before(() => {
      const instance = Languages.instance();
      instance.all(`${__dirname}/../langs/`);
    })

    its()

  });

});
