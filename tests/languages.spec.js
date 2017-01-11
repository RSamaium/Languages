const {expect} = require('chai');
const Languages = require('../src/languages')

describe('Test Language', function() {

  before(done => {
      Languages.init(['en_EN', 'fr_FR'], `${__dirname}/../langs/`, done);
  })

  it('Hello', () => {
    expect('hello'.t()).to.equal('Hello');
  })

  it('Local Language', () => {
    expect('hello'.t('fr_FR')).to.equal('Bonjour');
  })

  it('With in group', () => {
    expect('email'.t()).to.equal('Email');
  })

  it('Singular', () => {
    expect('new'.t(1)).to.equal('New');
  })

  it('Plurial - s', () => {
    expect('new'.t(2)).to.equal('News');
    expect('new'.t(3)).to.equal('News');
  })

  it('Other plurial - ies', () => {
    expect('directory'.t(2)).to.equal('Directories');
    expect('directory'.t(3)).to.equal('Directories');
  })

  it('With variable', () => {
    expect('welcome'.t('website')).to.equal('Welcome on website');
  })

  it('With two variable', () => {
    expect('step'.t(1, 3)).to.equal('Step 1 / 3');
  })

  it('Combination with {}', () => {
    expect('save as'.t()).to.equal('Save as');
  })

  it('Combination with group', () => {
    expect('all confirm'.t()).to.equal('All confirm');
  })

  it('Combination with parameter', () => {
    expect('you have nb message'.t(2)).to.equal('You have 2 messages');
  })

  it('Boolean', () => {
    expect('connection | logout'.t(true)).to.equal('Login');
    expect('connection | logout'.t(false)).to.equal('Logout');
  })

  it('Combination with parameter and boolean', () => {
    let nbMsg = 0;
    expect('you have nb message | you have no message'.t(nbMsg>0, nbMsg)).to.equal('You have no message');
    nbMsg = 3;
    expect('you have nb message | you have no message'.t(nbMsg>0, nbMsg)).to.equal(`You have ${nbMsg} messages`);
  });

  it('Combination with parameter and boolean in ()', () => {
    let nbMsg = 0;
    expect('you have (nb message | no message)'.t(nbMsg>0, nbMsg)).to.equal('You have no message');
  });

  it('Two IDs', () => {
    expect('you have + message'.t(2)).to.equal('You have messages');
  })

  describe('With namespace', function() {

    before(done => {
      Languages.add(["en_EN"], `${__dirname}/plugin/`, "plugin_name", done)
    })

    it('Hello', () => {
      expect('plugin_name.hello'.t()).to.equal('Hello world');
    })

  });


})
