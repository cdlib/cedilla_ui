'use strict';

describe('ourl services', function() {

  beforeEach(module('cdlaServices', 'lodash', 'cdlaConfig'));

  describe('configuration', function() {

    var cdlaProperties;

    beforeEach(inject(function(_cdlaProperties_) {
      cdlaProperties = _cdlaProperties_;
    }));

    it('should have properties for dev environment', function() {
      console.log("Property MAX_LINK_DISPLAY = " + cdlaProperties.MAX_LINK_DISPLAY);
      expect(cdlaProperties.MAX_LINK_DISPLAY).toBe(3);
    });

    it('should should have the correct citation url', function() {

      expect(cdlaProperties.CITATION_SERVICE_ADDRESS).toBe(cdlaProperties.AGGREGATOR_ADDRESS + 'citation');
    });

  });

  describe('merge authors ', function() {

    var cdlaCitationService;

    // instance variable for lodash
    var _;

    var newCitation = {'authors': [], 'title': 'the new title', 'publisher': 'new publisher'};
    var oldCitation = {'authors': [], 'title': 'the title'};
    newCitation.authors.push({'first': 'j1', 'last': 'f2'});
    oldCitation.authors.push({'first': 'j', 'last': 'f'});

    beforeEach(inject(function(cdlaCitation, ___) {
      cdlaCitationService = cdlaCitation;
      _ = ___;
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

    it('should merge two arrays of authors into first passed', function() {
      var mergedAuthors = cdlaCitationService.mergeAuthors(oldCitation.authors, newCitation.authors);
      expect(_.isEqual(mergedAuthors, [{'first': 'j', 'last': 'f'}, {'first': 'j1', 'last': 'f2'}])).toBe(true);
    });

    it('should merge two arrays of authors into first passed when the first is empty', function() {
      var auList = [];
      var mergedAuthors = cdlaCitationService.mergeAuthors(auList, newCitation.authors);
      expect(_.isEqual(mergedAuthors, [{'first': 'j1', 'last': 'f2'}])).toBe(true);
    });

    it('should merge two arrays of authors into first passed when the first is not truthy', function() {
      var auList = undefined;
      var mergedAuthors = cdlaCitationService.mergeAuthors(auList, newCitation.authors);
      expect(_.isEqual(mergedAuthors, [{'first': 'j1', 'last': 'f2'}])).toBe(true);
    });

    it('should return the first list unchanged if the second is not truthy', function() {
      var newAuList = undefined;
      var mergedAuthors = cdlaCitationService.mergeAuthors(oldCitation.authors, newAuList);
      expect(_.isEqual(mergedAuthors, [{'first': 'j', 'last': 'f'}])).toBe(true);
    });

    it('should merge two arrays of authors into first passed when the first is empty or not truthy', function() {
      var auList = [];
      var mergedAuthors = cdlaCitationService.mergeAuthors(auList, newCitation.authors);
      expect(_.isEqual(mergedAuthors, [{'first': 'j1', 'last': 'f2'}])).toBe(true);
    });

    it('should return an empty array if neither value is truthy', function() {
      var auList = undefined;
      var newAuList = null;
      var mergedAuthors = cdlaCitationService.mergeAuthors(auList, newAuList);
      expect(_.isEqual(mergedAuthors, [])).toBe(true);
    });
  });
  
  describe('merge citation ', function() {

    var cdlaCitationService;

    // instance variable for lodash
    var _;

    var newCitation = {'authors': [], 'title': 'the new title', 'publisher': 'new publisher'};
    var oldCitation = {'authors': [], 'title': 'the title'};
    newCitation.authors.push({'first': 'j1', 'last': 'f2'});
    oldCitation.authors.push({'first': 'j', 'last': 'f'});

    beforeEach(inject(function(cdlaCitation, ___) {
      cdlaCitationService = cdlaCitation;
      _ = ___;
    })); 

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

    it('should merge new authors when old authors is undefined', function() {
      oldCitation.authors = undefined;
      cdlaCitationService.mergeCitation(oldCitation, newCitation);
      expect(oldCitation.authors.length).toBe(1);
    });

  });


  describe('citation formatting behaviors', function() {

    var cdlaCitationFormatterService;

    // instance variable for lodash
    var _;


    beforeEach(inject(function(cdlaCitationFormatter, ___) {
      cdlaCitationFormatterService = cdlaCitationFormatter;
      _ = ___;
    }));

    it('formatter should be an object', function() {

      expect(typeof cdlaCitationFormatterService).toBe('object');
    });

  });

  describe('single author formatting behaviors', function() {

    var cdlaCitationFormatterService;

    // instance variable for lodash
    var _;
    var author;
    var authors;


    beforeEach(inject(function(cdlaCitationFormatter, ___) {
      cdlaCitationFormatterService = cdlaCitationFormatter;
      _ = ___;
      author = {last_name: 'Jones', first_name: 'John', initials: 'JP', first_initial: 'J', middle_initial: 'P', full_name: 'John Paul Jones'};
      authors = [];
      authors.push(author);
    }));

    it('should display lastname, initials if lastname and initials are present, ', function() {
      author.first_name = '';
      author.first_initial = '';
      author.full_name = '';
      author.middle_initial = '';
      expect(cdlaCitationFormatterService.formatAuthorSingle(author)).toBe('Jones, JP');
    });

    it('should use first and middle initial if available and if no initials field is present', function() {
      author.initials = '';
      author.first_name = '';
      author.full_name = '';
      expect(cdlaCitationFormatterService.formatAuthorSingle(author)).toBe('Jones, JP');
    });

    it('should use first letter of first name if no initial fields at all are present', function() {
      author.initials = '';
      author.first_initial;
      author.middle_initial = '';
      author.full_name = '';
      expect(cdlaCitationFormatterService.formatAuthorSingle(author)).toBe('Jones, J');
    });

    it('should prefer corporate author if present', function() {
      author.corporate_author = "IBM";
      expect(cdlaCitationFormatterService.formatAuthorSingle(author)).toBe('IBM');
    });

    it('use full name if no other name fields are present', function() {
      author.initials = '';
      author.first_initial;
      author.middle_initial = '';
      author.first_name = '';
      author.last_name = '';
      expect(cdlaCitationFormatterService.formatAuthorSingle(author)).toBe('John Paul Jones');
    });

    it('should return just the single author if it is the only author', function() {
      expect(cdlaCitationFormatterService.formatAuthors(authors)).toBe('Jones, JP, ');
    });

    it('should return the author plus et al. if there are multiple authors', function() {
      authors.push({ full_name : 'Jane Austen', last_name : 'Austen', first_name : 'Jane'});
      expect(cdlaCitationFormatterService.formatAuthors(authors)).toBe('Jones, JP, et al.');
    });

  });
});

