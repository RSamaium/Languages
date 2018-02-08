const {expect} = require('chai');
const pug = require('pug');
var Languages = require('../src/languages')

describe('Test Language', function() {

  before(done => {
      Languages = Languages.instance();
      Languages.init(['en_EN', 'fr_FR'], `${__dirname}/../langs/`, done);
  })

  it('Hello', () => {
    expect('hello'.t()).to.equal('Hello');
  })

  it('Value is null', () => {
    const val = Languages.translate(null)
    expect(val).to.equal('');
  })

  it('Value is undefined', () => {
    const val = Languages.translate(undefined)
    expect(val).to.equal('');
  })

  it('Connect', () => {
    expect('connect'.t()).to.equal('To connect');
    expect('connect help'.t()).to.equal('Connect help');
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

  it('Id not exists', () => {
    expect('foo'.t()).to.equal('');
  })

  describe('Compile template and Pug', function() {

    const customPattern =  {
      patternStart: '[',
      patternEnd: ']',
      pipe: '-',
      fnStart: '(',
      fnEnd: ')',
      paramsSeparator: ','
    }

    it('Simple render', () => {
      const render = Languages.render('{{hello | t}}')
      expect(render).to.equal('Hello');
    })

    it('Simple render with markups', () => {
      const render = Languages.render('<p>{{hello | t}}</p><p>{{hello | t}}</p>')
      expect(render).to.equal('<p>Hello</p><p>Hello</p>');
    })

    it('Simple render with quotation mark', () => {
      let render = Languages.render('{{"hello" | t}}')
      expect(render).to.equal('Hello');
      render = Languages.render('{{\'hello\' | t}}')
      expect(render).to.equal('Hello');
    })

    it('Render with 1 parameter', () => {
      const render = Languages.render('{{new | t:2}}')
      expect(render).to.equal('News');
    })

    it('Render with 2 parameters', () => {
      const render = Languages.render('{{step | t:1:3}}')
      expect(render).to.equal('Step 1 / 3');
    })

    it('Render with 2 parameters with markups', () => {
      const render = Languages.render('<p>{{step | t:1:3}}</p><p>{{hello | t}}</p>')
      expect(render).to.equal('<p>Step 1 / 3</p><p>Hello</p>');
    })

    it('Render with boolean', () => {
      const render = Languages.render('{{connection | logout | t:true}}')
      expect(render).to.equal('Login');
    })

    it('Render with custom pattern', () => {
      const render = Languages.render('[hello - t]', customPattern)
      expect(render).to.equal('Hello');
    })

    it('Render with custom pattern and 2 parameters', () => {
      const render = Languages.render('[step - t(1,3)]', customPattern)
      expect(render).to.equal('Step 1 / 3');
    })

    const pugRender = `p
      :translate() {{"hello" | t}} Sam`

    it('Render with Pug', () => {
      let render = pug.render(pugRender, {
        filters: {
          translate: function (text) {
            return Languages.render(text);
          }
        }
      });
      expect(render).to.equal('<p>Hello Sam</p>');
    })

    it('Render with Pug method', () => {
      let render = pug.render(pugRender, {filters: Languages.load.Pug() });
      expect(render).to.equal('<p>Hello Sam</p>');
    })

    it('Render with Pug method and other filters', () => {
      let render = pug.render(pugRender, {filters: Languages.load.Pug({
        otherFilter: {}
      })});
      expect(render).to.equal('<p>Hello Sam</p>');
    })

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
