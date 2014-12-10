

describe('angularjs homepage todo list', function() {
  it('should add a todo', function() {
    browser.get('http://0.0.0.0:18880/#/');
    var libs = element(by.id('uc_libs'));
    expect(libs).not.toBe(null);
  });
});


