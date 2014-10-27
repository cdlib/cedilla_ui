'use strict';

describe('digitalLinksFilter', function() {

  beforeEach(module('cdlaFilters'));

  describe('digital links filter', function() {

    var digitalLinksFilter;

    // Note that Angular uses a naming convention here, appending "Filter" to the filter name
    beforeEach(inject(function(_digitalLinksFilter_) {
      digitalLinksFilter = _digitalLinksFilter_;
    }));

    it('should be a function', function() {
      expect(typeof digitalLinksFilter).toBe('function');
    });

    it('should filter out non-electronic items and items with no source', function() {
      var items = [];
      items.push({format: 'electronic', source: 'test-source'});
      items.push({format: 'print', source: 'test-source 1'});
      items.push({source: 'test-source 1'});
      items.push({format: 'electronic', source: ''});
      expect(digitalLinksFilter(items).length).toBe(1);
    });
  });

  describe('print holdings filter', function() {

    var printHoldingsFilter;
    var items;

    // Note that Angular uses a naming convention here, appending "Filter" to the filter name
    beforeEach(inject(function(_printHoldingsFilter_) {
      printHoldingsFilter = _printHoldingsFilter_;
      items = [];
    }));

    it('should be a function', function() {
      expect(typeof printHoldingsFilter).toBe('function');
    });

    it('should filter out non-print items', function() {
      items.push({format: 'electronic', location: 'test-loc 1', local_id: 'id'});
      items.push({format: 'print', location: 'test-loc 1', local_id: 'id'});
      items.push({format: 'xxxx', location: 'test-loc 2', local_id: 'id2'});
      items.push({format: '', location: 'test-loc 3', local_id: 'id3'});
      expect(printHoldingsFilter(items).length).toBe(1);
    });

    it('should filter items that do not have both location and local_id', function() {
      items.push({format: 'print', location: 'test-loc 1', local_id: 'id'});
      items.push({format: 'print', location: 'test-loc 1', local_id: ''});
      items.push({format: 'print', location: undefined, local_id: 'id2'});
      items.push({format: 'print', location: undefined, local_id: undefined});
      expect(printHoldingsFilter(items).length).toBe(1);
    });
  });
});
