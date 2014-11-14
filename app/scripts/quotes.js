'use strict';

var cdlaQuotes = angular.module('cdlaQuotes', []);
var quotes = [];
quotes.push({quote: 'We are asleep. Our Life is a dream. But we wake up sometimes, just enough to know that we are dreaming.', author: 'Ludwig Wittgenstein'});
      //  quotes.push({quote: '')

                var randomInt = function(min, max) {
                  return Math.floor(Math.random() * (max - min + 1) + min);
                };

        cdlaQuotes.factory('cdlaQuoter', function() {
          return {getRandomQuote: function() {
              var ri = randomInt(0, quotes.length - 1);
              return quotes[ri];
            }};
        });
