const {expect} = require('chai')
var Languages = require('../src/languages')

describe('Test Group Language', function() {

  before(done => {
      Languages = Languages.instance();
      Languages.init(['en_EN'], `${__dirname}/fixtures/`, done)
  })

  it ('Test Array group', () => {
    const group = Languages.getGroup('mygroup')
    expect(group).to.deep.equal(['mygroup_0', 'mygroup_1'])
  })

})