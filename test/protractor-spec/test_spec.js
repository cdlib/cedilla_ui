

describe('Cedilla landing page', function() {
  
  beforeEach(function() {
    browser.get('');
  });
  
  it('should have the right title', function() {
    expect(browser.getTitle()).toEqual('Get it from the UC Libraries');
  });
  
  it('should have the UC Libraries text', function() {
    var ucLibsName = element(by.id('uc_libs_name'));
    expect(ucLibsName.getText()).toEqual('UC Libraries');
  });
  
  it('should have the home button active', function() {
    var homeButtonName = element(by.id('home_button'));
    var testButtonName = element(by.id('test_links_button'));
    expect(homeButtonName.getAttribute('class')).toEqual('active');
    expect(testButtonName.getAttribute('class')).not.toEqual('active');
  });
});

describe('Cedilla fulltext page', function() {
  
  beforeEach(function() {
    browser.get('http://localhost:18880/#/ourl?cedilla:affiliation=ucb&genre=article&issn=1350231X&title=Journal+of+Brand+Management&volume=11&issue=1&date=20030901&atitle=Ad+spending+on+brand+extensions%3a+does+similarity+matter%3f&spage=63&sid=EBSCO:cax&pid=');
  });
  
  it('should have the right title', function() {
    expect(browser.getTitle()).toEqual('Get it from the UC Libraries');
  });
  
  it('should have the UC Libraries text', function() {
    var ucLibsName = element(by.id('uc_libs_name'));
    expect(ucLibsName.getText()).toEqual('UC Libraries');
  });
  
  it('should not have active buttons', function() {
    var homeButtonName = element(by.id('home_button'));
    var testButtonName = element(by.id('test_links_button'));
    expect(homeButtonName.getAttribute('class')).not.toEqual('active');
    expect(testButtonName.getAttribute('class')).not.toEqual('active');
  });
  
  it('should display a progress bar', function() {
    
  });
});


