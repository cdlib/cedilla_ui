'use strict';

describe('Service: cdlaCitation', function() {

  beforeEach(module('cdlaServices'));

  var cdlaCitationService;

  var newCitation = {'authors': [], 'title': 'the new title', 'publisher': 'new publisher'};
  var oldCitation = {'authors': [], 'title': 'the title'};
  newCitation.authors.push({'first': 'j1', 'last': 'f2'});
  oldCitation.authors.push({'first': 'j', 'last': 'f'});


  beforeEach(inject(function(cdlaCitation) {
    cdlaCitationService = cdlaCitation;
  }));

  it('should merge citation string properties', function() {
    cdlaCitationService.mergeCitation(oldCitation, newCitation);
    expect(oldCitation.publisher).toBe('new publisher');
    expect(oldCitation.title).toBe('the title');

    cdlaCitationService.mergeCitation(oldCitation, newCitation, true);
    expect(oldCitation.publisher).toBe('new publisher');
    expect(oldCitation.title).toBe('the new title');
  });

  it('should return true if there is a matching author', function() {
    var auList = [{'first': 'John', 'last': 'Jones'}, {'first': 'James', 'last': 'Joyce'}];
    var au = {'first': 'John', 'last': 'Jones'};
    expect(cdlaCitationService.hasEqualAuthor(auList, au)).toBe(true);
  });

  it('should return false if there is no matching author', function() {
    var auList = [{'first': 'John', 'last': 'Jones'}, {'first': 'James', 'last': 'Joyce'}];
    var au = {'first': 'Jane', 'last': 'Austen'};
    expect(cdlaCitationService.hasEqualAuthor(auList, au)).toBe(false);
  });

  it('should throw an exception if author is undefined', function() {
    var auList = [{'first': 'John', 'last': 'Jones'}, {'first': 'James', 'last': 'Joyce'}];
    var au = null;
    var testFunc = function() {
      return cdlaCitationService.hasEqualAuthor(auList, au);
    };
    expect(testFunc).toThrow();
  });

  it('should return false if the list is empty', function() {
    var auList = [];
    var au = {'first': 'Jane', 'last': 'Austen'};
    expect(cdlaCitationService.hasEqualAuthor(auList, au)).toBe(false);
  });

  it('should merge new authors', function() {
    cdlaCitationService.mergeCitation(oldCitation, newCitation);
    expect(oldCitation.authors.length).toBe(2);
  });
  
  it ('should merge new authors when old authors is undefined', function () {
    oldCitation.authors = undefined;
    cdlaCitationService.mergeCitation(oldCitation, newCitation);
    expect(oldCitation.authors.length).toBe(1);
  });

});

