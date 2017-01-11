const {expect} = require('chai');
const Languages = require('../src/languages')

describe('Test Sync Language', function() {

  before(() => {
      Languages.init(['en_EN', 'fr_FR'], `${__dirname}/../langs/`);
  })

  it('Hello', () => {
    expect('hello'.t()).to.equal('Hello');
  })

});
