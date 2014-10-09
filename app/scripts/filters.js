'use strict';

/**
 * Filters module. All cdla_ui filters go here.
 */

var cdlaFilters = angular.module('cdlaFilters', []);
 
cdlaFilters.filter('digitalLinks', function(){
  return function(items){ 
    console.log("got list of length " + items.length);
    var filterItems = [];
    var i;
    for (i = 0; i < items.length; i++) {
      console.log("checking item " + i + JSON.stringify(items[i]))
      if (items[i].format === 'electronic' && items[i].source) {
        filterItems.push(items[i]);
      }
    }
    return filterItems;
}});
