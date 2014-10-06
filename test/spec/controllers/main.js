'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('cdlaControllers'));

  var MainCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', { $scope: scope });
  }));

  it('should be on the home page', function () {
    expect(scope.navState.currentPage).toBe('home');
  });

});

describe('Controller: HomeCtrl', function () {

  beforeEach(module('cdlaControllers'));

  var HomeCtrl, MainCtrl;
  var mainScope, childScope;

  beforeEach(inject(function ($controller, $rootScope) {
    mainScope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', { $scope : mainScope });
    childScope = mainScope.$new(); 
    HomeCtrl = $controller('HomeCtrl', { $scope : childScope });
  }));

  it('should be on the home page', function () {
    expect(childScope.$parent.navState.currentPage).toBe('home'); 
  });

});


describe('Controller: TestCtrl', function () {

  beforeEach(module('cdlaControllers'));

  var TestCtrl, MainCtrl;
  var mainScope, childScope;

  beforeEach(inject(function ($controller, $rootScope) {
    mainScope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', { $scope : mainScope });
    childScope = mainScope.$new();
    TestCtrl = $controller('TestCtrl', { $scope : childScope });
  }));

  it('should be on the test', function () {
    expect(childScope.$parent.navState.currentPage).toBe('test');
  });

});

