'use strict';

describe('cdlaCitationService', function() {

  beforeEach(module('cdlaServices', 'lodash'));

  var cdlaCitationService;
  
  // instance variable for lodash
  var __;

  var newCitation = {'authors': [], 'title': 'the new title', 'publisher': 'new publisher'};
  var oldCitation = {'authors': [], 'title': 'the title'};
  newCitation.authors.push({'first': 'j1', 'last': 'f2'});
  oldCitation.authors.push({'first': 'j', 'last': 'f'});

  beforeEach(inject(function(cdlaCitation, _) {
    cdlaCitationService = cdlaCitation;
    __ = _;
  }));

  it('hasEqualAuthor should return true if there is a matching author', function() {
    var auList = [{'first': 'John', 'last': 'Jones'}, {'first': 'James', 'last': 'Joyce'}];
    var au = {'first': 'John', 'last': 'Jones'};
    expect(cdlaCitationService.hasEqualAuthor(auList, au)).toBe(true);
  });

  it('hasEqualAuthor should return false if there is no matching author', function() {
    var auList = [{'first': 'John', 'last': 'Jones'}, {'first': 'James', 'last': 'Joyce'}];
    var au = {'first': 'Jane', 'last': 'Austen'};
    expect(cdlaCitationService.hasEqualAuthor(auList, au)).toBe(false);
  });

  it('hasEqualAuthor should throw an exception if author is undefined', function() {
    var auList = [{'first': 'John', 'last': 'Jones'}, {'first': 'James', 'last': 'Joyce'}];
    var au = null;
    var testFunc = function() {
      return cdlaCitationService.hasEqualAuthor(auList, au);
    };
    expect(testFunc).toThrow();
  });

  it('hasEqualAuthor should return false if the list is empty', function() {
    var auList = [];
    var au = {'first': 'Jane', 'last': 'Austen'};
    expect(cdlaCitationService.hasEqualAuthor(auList, au)).toBe(false);
  });
  
 it('mergeAuthors should merge two arrays of authors into first passed', function() {
    var mergedAuthors = cdlaCitationService.mergeAuthors(oldCitation.authors, newCitation.authors);
    expect(__.isEqual(mergedAuthors, [{'first': 'j', 'last': 'f'},{'first': 'j1', 'last': 'f2'}])).toBe(true);
  });
  
  it('mergeAuthors should merge two arrays of authors into first passed when the first is empty', function() {
    var auList = [];
    var mergedAuthors = cdlaCitationService.mergeAuthors(auList, newCitation.authors);
    expect(__.isEqual(mergedAuthors, [{'first': 'j1', 'last': 'f2'}])).toBe(true);
  });
  
  it('mergeAuthors should merge two arrays of authors into first passed when the first is not truthy', function() {
    var auList = undefined;
    var mergedAuthors = cdlaCitationService.mergeAuthors(auList, newCitation.authors);
    expect(__.isEqual(mergedAuthors, [{'first': 'j1', 'last': 'f2'}])).toBe(true);
  });
  
  it('mergeAuthors should return the first list unchanged if the second is not truthy', function() {
    var newAuList = undefined;
    var mergedAuthors = cdlaCitationService.mergeAuthors(oldCitation.authors, newAuList);
    expect(__.isEqual(mergedAuthors, [{'first': 'j', 'last': 'f'}])).toBe(true);
  });
  
 it('mergeAuthors should merge two arrays of authors into first passed when the first is empty or not truthy', function() {
    var auList = [];
    var mergedAuthors = cdlaCitationService.mergeAuthors(auList, newCitation.authors);
    expect(__.isEqual(mergedAuthors, [{'first': 'j1', 'last': 'f2'}])).toBe(true);
  });
  
   it('mergeAuthors should return an empty array if neither value is truthy', function() {
    var auList = undefined;
    var newAuList = null;
    var mergedAuthors = cdlaCitationService.mergeAuthors(auList, newAuList);
    expect(__.isEqual(mergedAuthors, [])).toBe(true);
  });

  it('mergeCitation should merge citation string properties', function() {
    cdlaCitationService.mergeCitation(oldCitation, newCitation);
    expect(oldCitation.publisher).toBe('new publisher');
    expect(oldCitation.title).toBe('the title');

    cdlaCitationService.mergeCitation(oldCitation, newCitation, true);
    expect(oldCitation.publisher).toBe('new publisher');
    expect(oldCitation.title).toBe('the new title');
  });

  it('mergeCitation should merge new authors', function() {
    cdlaCitationService.mergeCitation(oldCitation, newCitation);
    expect(oldCitation.authors.length).toBe(2);
  });

  it('mergeCitation should merge new authors when old authors is undefined', function() {
    oldCitation.authors = undefined;
    cdlaCitationService.mergeCitation(oldCitation, newCitation);
    expect(oldCitation.authors.length).toBe(1);
  });

});

