const {expect} = require('chai');
var Languages = require('../src/languages')

describe('Test Sync Language', function() {

  before(() => {
      Languages = Languages.instance();
      Languages.init(['en_EN', 'fr_FR'], `${__dirname}/../langs/`);
  })

  it('Hello', () => {
    expect('hello'.t()).to.equal('Hello');
  })

});
