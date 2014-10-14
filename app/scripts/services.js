'use strict';

/**
 * Services module. All cdla_ui services go here.
 * Services are injected into controllers or into other services 
 */

var cdlaServices = angular.module('cdlaServices', []);

/**
 * Socket listener listens on a socket and updates the model.
 *
 */
cdlaServices.factory('cdlaSocketListener', ['$sce', function($sce) {
    var listener = {};
    listener.listen = function(socket, scope) {
      socket.emit('openurl', scope.item.query);
      console.log('emitted openurl client event with params ' + scope.item.query);

      socket.on('complete', function() {
        console.log('data stream is complete');
      });

      socket.on('citation', function(data) {
        console.log('Handling citation event, data: ' + data);
        var citationUpdate = JSON.parse(data);
        console.log('Updated citation with ' + citationUpdate);
        scope.item.citationEvents.push(citationUpdate);
      });

      socket.on('resource', function(data) {
        console.log('Handling resource event, data: ' + data);
        var newResource = JSON.parse(data);
        console.log('Adding new resource: ' + newResource);
        scope.item.resources.push(newResource.resource);
        if (!scope.item.fullTextTarget && newResource.resource.format === 'electronic') {
          console.log('Setting fullTextTarget = ' + newResource.resource.target);
          scope.item.fullTextTarget = $sce.trustAsResourceUrl(newResource.resource.target);
          scope.viewState.showOptions = false;
          scope.viewState.showFullText = true;
        }
      });

      socket.on('error', function(data) {
        console.log('Handling error event, data: ' + data);
        scope.error = data;
      });
    };

    return listener;
  }]);

cdlaServices.factory('cdlaSocket', function(socketFactory) {
  return socketFactory({
    /* global io */
    ioSocket: io.connect('http://cdla-api-stg.cdlib.org:3005/')
  });
});


cdlaServices.factory('cdlaCitation', ['$http', 'cdlaCitationFormatter', function($http, citationFormatter) {

    var cdlaCitation = {};
    var _http = $http;

    /*
     * Returns a deferred query result
     */
    cdlaCitation.initCitation = function(item) {
      console.log('initCitation using ' + JSON.stringify(item.query) + ' and ' + item.citation);
      var self = this;
      _http.get('http://localhost:3005/citation?' + item.query)
              .success(function(data, status, headers, config) {
                console.log('incoming citation is ' + typeof data + " " + JSON.stringify(data));
                item.citation = self.mergeCitation(item.citation, data, true);
                item.displayCitation = citationFormatter.toDisplayCitation(item.citation);
              })
              .error(function(data, status, headers, config) {
                console.log('error is ' + JSON.stringify(data));
              });
      return this;
    };

    /**
     * Merge the properties of newCitation into citation.
     * 
     * @param citation the citation we already have
     * @param newCitation a new citation coming in
     * @param overwrite whether to overwrite citation data if it is already there
     * 
     * TODO: this routine apply to any object, so do we need one for just citations?
     */
    cdlaCitation.mergeCitation = function(citation, newCitation, overwrite) {
      var _citation = citation;
      for (var key in newCitation) {
        if (newCitation.hasOwnProperty(key) && newCitation[key]) {
          if (overwrite) {
            _citation[key] = newCitation[key];
          } else {
            if (!citation[key]) {
              _citation[key] = newCitation[key];
            }
          }
        }
      }
      return _citation;
    };


    cdlaCitation.description = 'citation service';

    return cdlaCitation;
  }]);


/*
 * Service for citation formatter helper object.
 * This object formats various strings related to the citation
 * for display on screen or in conventional citation formats.
 */
cdlaServices.factory('cdlaCitationFormatter', function() {

  var citationFormatter = {};

  /**
   * citation formatter methods
   */
  citationFormatter.toDisplayCitation = function(citation) {
    console.log("Called getModel with citation " + JSON.stringify(citation));
    return citationDisplayModel.toDisplayFormat(citation);
  };

  /*
   * Model for display of citation information on page
   */
  var citationDisplayModel = {
    /*
     * Update the display, also used to initialize the display.
     * (Note: the working assumption is that we will override something
     * that has already been set; that is, the citation information coming from the aggregator must be authoritative.)
     */
    toDisplayFormat: function(citation) {

      this.genre = citation.genre;
      this.volume = citation.volume;
      this.issue = citation.issue;
      this.publisher = citation.publisher;
      this.title = format_part_title(citation);
      this.pages = format_pages(citation);
      this.container_title = formatContainerTitle(citation);
      this.authors = format_authors(citation);
      this.year = format_year(citation);
      this.date = format_date(citation);
      this.volume = citation.volume;
      this.issue = citation.issue;
      this.pages = format_pages(citation);

      if (citation.sample_cover_image) {
        this.cover_image = citation.sample_cover_image;
      }
      return this;
    }
  };


  /**
   * Private functions
   */


  /**
   * The title field displays the part title, if available
   * For example, if item is a journal article, title is the article title
   * If the item is a book in a monographic series, the title is the book title
   */
  var format_part_title = function(citation) {
    if (citation.article_title) {
      return citation.article_title.trim();
    }
    if (citation.book_title && citation.genre === "series") {
      return citation.book_title.trim();
    }
    return "";
  };

  var formatContainerTitle = function(citation) {
    var result = "";
    if (citation.journal_title) {
      result = citation.journal_title;
    }
    if (citation.title) {
      result = citation.title;
    }
    if (citation.short_title) {
      result = citation.short_title;
    }
    return result.trim();
  };

  /**
   * Return a display string for a single author or list of authors.
   */
  var format_authors = function(citation) {

    if (!citation.authors || !citation.authors.length) {
      return null;
    }
    return format_author_single(citation.authors['0']);
  };

  /**
   * Return a display string for a single author.
   */
  var format_author_single = function(author) {
    var first_name = author.first_name;
    var last_name = author.last_name;
    var initials = author.initials;
    var middle_initial = author.middle_initial ? author.middle.initial : "";
    var full_name = author.full_name;
    var corporate_name = author.corporate_author;
    var formatted_name = "";
    if (!first_name) {
      if (!initials)
        formatted_name = last_name;
      else
        formatted_name = last_name + ", " + initials;
    } else {
      if (!middle_initial)
        formatted_name = last_name + ", " + first_name;
      else
        formatted_name = last_name + ", " + first_name + " " + middle_initial;
    }
    if (!formatted_name) {
      formatted_name = corporate_name;
    }
    if (!formatted_name) {
      formatted_name = full_name;
    }
    return formatted_name;
  };

  var format_pages = function(citation) {
    if (citation.pages) {
      return citation.pages.trim();
    }
    if (!citation.start_page) {
      return "";
    }
    var end_page = citation.end_page;
    if (!end_page) {
      end_page = "";
    }
    return citation.start_page.trim() + "-" + end_page.trim();
  };

  var format_year = function(citation) {
    if (citation.publication_date) {
      return citation.publication_date.trim().substring(0, 4);
    }
    return "";
  };

  var format_date = function(citation) {
    // if a whole date is provided in the ourl use that
    var date = citation.publication_date;
    if (date) {
      // TODO: validate? we are trusting the provider here
      return date;
    }
    // otherwise, first see if there is a year
    else {
      date = citation.year;
    }
    // if no date is provided and no year, return null
    if (!date) {
      return null;
    }
    // append month and day values if they are there
    var month = citation.month;
    if (month) {
      if (month.length === 1) {
        month = "0" + month;
      }
      date += "-" + month;
    } else {
      return date;
    }
    var day = citation.day;
    if (day) {
      if (day.length === 1) {
        day = "0" + day;
      }
      date += "-" + day;
    }
    return date;

  };

  /**
   * Checks whether the cite display has a trailing comma or period and removes it.
   * TODO: This can be a filter in angular, not used here
   */
  //   var remove_trailing_char = function(cite_display) {
  //       return cite_display.replace(/[.,]<\/span><\/div>/, "</span></div>");
  //   };

  return citationFormatter;
});
