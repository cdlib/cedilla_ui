'use strict';

/**
 * Services module. All cdla_ui services go here.
 * Services are injected into controllers or into other services 
 */

var cdlaServices = angular.module('cdlaServices', ['lodash', 'handlebars', 'cdlaConfig']);

/**
 * Socket listener listens on a socket and updates the model.
 *
 */
cdlaServices.factory('cdlaSocketListener', [function() {
    var listener = {};
    listener.listen = function(socket, responder, query) {
      socket.emit('openurl', query);
      console.log('emitted openurl client event with params ' + query);

      socket.on('complete', function() {
        responder.handleComplete();
      });

      socket.on('citation', function(data) {
        responder.handleCitation(data);
      });

      socket.on('resource', function(data) {
        responder.handleResource(data);
      });

      socket.on('error', function(data) {
        responder.handleError(data);
      });
    };

    return listener;
  }]);


cdlaServices.factory('cdlaSocket', ['socketFactory', 'cdlaProperties', function(socketFactory, properties) {
    return socketFactory({
      /* global io */
      ioSocket: io.connect(properties.AGGREGATOR_ADDRESS)
    });
  }]);

cdlaServices.factory('cdlaCitation', ['$http', 'cdlaCitationFormatter', '_', 'cdlaProperties', function($http, citationFormatter, _, properties) {

    var cdlaCitation = {};
    var _http = $http;

    /*
     * Returns a deferred query result
     */
    cdlaCitation.initCitation = function(item) {
      console.log('initCitation using ' + JSON.stringify(item.query) + ' and ' + item.citation);
      var self = this;

      _http.get(properties.CITATION_SERVICE_ADDRESS + '?' + item.query)
              //.success(function(data, status, headers, config) { // documents available params on callback
              .success(function(data) {
                //console.log('incoming citation is ' + typeof data + ' ' + JSON.stringify(data));
                item.originalCitation = data;
                self.mergeCitation(item.citation, data, true);
                //console.log('merged citation is ' + typeof data + ' ' + JSON.stringify(item.citation));
                item.displayCitation = citationFormatter.toDisplayCitation(item.citation);
                //console.log('Display citation is now ' + JSON.stringify(item.displayCitation));
              })
              //.error(function(data, status, headers, config) { // documents available params on callback
              .error(function(data) {
                console.log('error: ' + JSON.stringify(data));
              });
      return this;
    };

    /**
     * Returns true if authors has any object equal to author.
     * 
     * @param array authors a list of authors
     * @param Object author
     * @returns array of authors
     * 
     * TODO: this is case sensitive! Maybe lodash has an alternative.
     */
    cdlaCitation.hasEqualAuthor = function(authors, author) {
      if (!author) {
        throw 'Author is not defined';
      }
      for (var i = 0; i < authors.length; i++) {
        if (_.isEqual(authors[i], author)) {
          return true;
        }
      }
      return false;
    };

    /**
     * Merges the newAuthors list into the authors list.
     * 
     * @param authors an array of author objects to merge into
     * @param newAuthors an array of author objects to merge
     * @returns of authors the merged array
     */
    cdlaCitation.mergeAuthors = function(authors, newAuthors) {
      console.log('called merge authors authors = ' + JSON.stringify(authors) + ' and newAuthors = ' + JSON.stringify(newAuthors));

      var i;

      // if newAuthors is empty or not truthy return authors
      if (!newAuthors || newAuthors.length < 1) {
        if (!authors) {
          authors = [];
        }
        return authors;
      }

      // if the original author is empty copy in all the new authors
      if (!authors || authors.length < 1) {
        authors = [];
        for (i = 0; i < newAuthors.length; i++) {
          authors.push(newAuthors[i]);
        }
        return authors;
      }

      // copy authors so that we don't iterate over a list that is being modified
      var tmpAuthors = [];

      for (i = 0; i < authors.length; i++) {
        tmpAuthors.push(authors[i]);
      }

      for (i = 0; i < newAuthors.length; i++) {
        if (!this.hasEqualAuthor(authors, newAuthors[i])) {
          tmpAuthors.push(newAuthors[i]);
        }
      }
      return tmpAuthors;
    };

    /**
     * Merge the properties of newCitation into citation.
     * 
     * @param citation the citation we already have
     * @param newCitation a new citation coming in
     * @param overwrite whether to overwrite citation data if it is already there
     * 
     */
    cdlaCitation.mergeCitation = function(citation, newCitation, overwrite) {
      //console.log('merging ' + JSON.stringify(newCitation) + ' into ' + JSON.stringify(citation));
      for (var key in newCitation) {
        if (newCitation.hasOwnProperty(key) && newCitation[key]) {
          if (key === 'authors') {
            citation.authors = this.mergeAuthors(citation[key], newCitation[key]);
            //console.log('merged authors result is ' + JSON.stringify(citation[key]));
          } else {
            if (overwrite) {
              citation[key] = newCitation[key];
              //console.log('added ' + JSON.stringify(citation[key]));
            } else {
              if (!citation[key]) {
                citation[key] = newCitation[key];
                //console.log('added ' + JSON.stringify(citation[key]));
              }
            }
          }
        }
      }
      //console.log('citation is now ' + JSON.stringify(citation));
    };

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
    var display = citationDisplayModel.toDisplayFormat(citation);
    return display;
  };

  /**
   * Return a display string for a single author or list of authors.
   */
  citationFormatter.formatAuthors = function(authors) {

    if (!authors || !authors.length) {
      return '';
    }
    var display = citationFormatter.formatAuthorSingle(authors['0']);
    if (authors.length === 1) {
      display = display + '. ';
    }
    if (authors.length > 1) {
      display = display + ', et al.';
    }
    return display;
  };

  /**
   * Return a display string for a single author.
   */
  citationFormatter.formatAuthorSingle = function(author) {

    initializeAuthor(author);
    console.log('Formatting author' + JSON.stringify(author));
    var formattedName = '';

    if (author.corporate_author) {
      return author.corporate_author;
    }
    if (!author.initials)
    {
      formattedName = author.last_name;
    }
    else
    {
      formattedName = author.last_name + ', ' + author.initials;
    }
    if (!formattedName) {
      {
        formattedName = author.full_name;
      }
    }
    return formattedName;
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
      this.title = formatPartTitle(citation);
      this.pages = formatPages(citation);
      this.container_title = formatContainerTitle(citation);
      this.authors = citationFormatter.formatAuthors(citation.authors);
      this.year = formatYear(citation);
      this.date = formatDate(citation);
      this.volume = citation.volume;
      this.issue = citation.issue;
      this.pages = formatPages(citation);

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
  var formatPartTitle = function(citation) {
    if (citation.article_title) {
      return citation.article_title.trim();
    }
    if (citation.book_title && citation.genre === 'series') {
      return citation.book_title.trim();
    }
    return '';
  };

  var formatContainerTitle = function(citation) {
    var result = '';
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

  var initializeAuthor = function(author) {
    if (!author.last_name) {
      author.last_name = '';
    }
    if (!author.first_name) {
      author.first_name = '';
    }
    if (!author.full_name) {
      author.full_name = '';
    }
    if (!author.first_initial) {
      author.first_initial = '';
    }
    if (!author.middle_initial) {
      author.middle_initial = '';
    }
    if (!author.corporate_name) {
      author.corporate_name = '';
    }
    author.initials = formatAuthorInitials(author);
  };

  var formatAuthorInitials = function(author) {
    if (author.initials) {
      return author.initials;
    }
    if (author.first_initial && author.middle_initial) {
      return author.first_initial + author.middle_initial;
    }
    if (author.first_name) {
      return (author.first_name.substr(0, 1) + author.middle_initial);
    }
    return '';
  };

  var formatPages = function(citation) {
    if (citation.pages) {
      return citation.pages.trim();
    }
    if (!citation.start_page) {
      return '';
    }
    var end_page = citation.end_page;
    if (!end_page) {
      end_page = '';
    }
    return citation.start_page.trim() + '-' + end_page.trim();
  };

  var formatYear = function(citation) {
    if (citation.publication_date) {
      return citation.publication_date.trim().substring(0, 4);
    }
    return '';
  };

  var formatDate = function(citation) {
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
        month = '0' + month;
      }
      date += '-' + month;
    } else {
      return date;
    }
    var day = citation.day;
    if (day) {
      if (day.length === 1) {
        day = '0' + day;
      }
      date += '-' + day;
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