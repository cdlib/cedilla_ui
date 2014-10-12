'use strict';

describe('Controller: MainCtrl', function() {

    // load the controller's module
    beforeEach(module('cdlaControllers'));

    var MainCtrl,
            scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope) {
        scope = $rootScope.$new();
        MainCtrl = $controller('MainCtrl', {$scope: scope});
    }));

    it('should be on the home page', function() {
        expect(scope.navState.currentPage).toBe('home');
    });

});

describe('Controller: HomeCtrl', function() {

    beforeEach(module('cdlaControllers'));

    var HomeCtrl, MainCtrl;
    var mainScope, childScope;

    beforeEach(inject(function($controller, $rootScope) {
        mainScope = $rootScope.$new();
        MainCtrl = $controller('MainCtrl', {$scope: mainScope});
        childScope = mainScope.$new();
        HomeCtrl = $controller('HomeCtrl', {$scope: childScope});
    }));

    it('should be on the home page', function() {
        expect(childScope.$parent.navState.currentPage).toBe('home');
    });

});


describe('Controller: TestCtrl', function() {

    beforeEach(module('cdlaControllers'));

    var TestCtrl, MainCtrl;
    var mainScope, childScope;

    beforeEach(inject(function($controller, $rootScope) {
        mainScope = $rootScope.$new();
        MainCtrl = $controller('MainCtrl', {$scope: mainScope});
        childScope = mainScope.$new();
        TestCtrl = $controller('TestCtrl', {$scope: childScope});
    }));

    it('should be on the test', function() {
        expect(childScope.$parent.navState.currentPage).toBe('test');
    });

});

describe('Service: testService', function() {

    beforeEach(module('cdlaServices'));

    var _cdlaTest;

    beforeEach(inject(function(cdlaTest) {
        _cdlaTest = cdlaTest;
    }));

    it('should be a test', function() {
        expect(_cdlaTest.description).toBe('test');
        expect(_cdlaTest.inner).toBe('test inner');
    });

});

describe('Service: cdlaCitation', function() {

    beforeEach(module('cdlaServices'));

    var _cdlaCitation;

    beforeEach(inject(function(cdlaCitation) {
        _cdlaCitation = cdlaCitation;
    }));

    it('should have the correct description', function() {
        expect(_cdlaCitation.description).toBe('citation service');
    });

});

