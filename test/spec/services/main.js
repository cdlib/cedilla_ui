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

  it('should have the correct description', function() {
    expect(cdlaCitationService.description).toBe('citation service');
  });

  it('should merge citation string properties', function() {
    cdlaCitationService.mergeCitation(oldCitation, newCitation);
    expect(oldCitation.publisher).toBe('new publisher');
    expect(oldCitation.title).toBe('the title');

    cdlaCitationService.mergeCitation(oldCitation, newCitation, true);
    expect(oldCitation.publisher).toBe('new publisher');
    expect(oldCitation.title).toBe('the new title');
  });

  it('should merge new authors', function() {

    cdlaCitationService.mergeCitation(oldCitation, newCitation);
    expect(oldCitation.authors.length).toBe(2);

  });

});

