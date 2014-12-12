exports.config = {
  // If no other method of starting Selenium
  // Server is found, this will default to
  // node_modules/protractor/selenium/selenium-server...
  //  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['protractor-spec/*_spec.js'],
  baseUrl: 'http://localhost:18880/#'
};
