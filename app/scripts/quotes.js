'use strict';

var cdlaQuotes = angular.module('cdlaQuotes', []);
var quotes = [];
quotes.push({quote: 'We are asleep. Our Life is a dream. But we wake up sometimes, just enough to know that we are dreaming.', author: 'Ludwig Wittgenstein'});
quotes.push({quote: 'At the core of all well-founded belief lies belief that is unfounded.', author: 'Ludwig Wittgenstein'});
quotes.push({quote: 'When we can\'t think for ourselves, we can always quote', author: 'Ludwig Wittgenstein'});
quotes.push({quote: '"Google" is not a synonym for "research".', author: 'Dan Brown'});
quotes.push({quote: 'You\'d be amazed how much research you can get done when you have no life whatsoever.', author: 'Ernest Cline'});
quotes.push({quote: 'Knowledge is power.', author: 'Francis Bacon'});
quotes.push({quote: 'The greatest part of a writer\'s time is spent in reading, in order to write: a man will turn over half a library to make one book.', author: 'Samuel Johnson'});
quotes.push({quote: 'Science is simply common sense at its best, that is, rigidly accurate in observation, and merciless to fallacy in logic.', author: 'Thomas Henry Huxley'});
quotes.push({quote: 'An expert is one who knows more and more about less and less until he knows absolutely everything about nothing.', author: 'Nicholas Murray Butler'});
quotes.push({quote: 'Shall we educate ourselves in what is known, and then casting away all we have acquired, turn to ignorance for aid to guide us among the unknown?', author: 'Michael Faraday'});
quotes.push({quote: 'The very existence of libraries affords the best evidence that we may yet have hope for the future of man.', author: 'T.S. Eliot'});
quotes.push({quote: 'Google can bring you back 100,000 answers. A librarian can bring you back the right one.', author: 'Neil Gaiman'});
quotes.push({quote: 'Librarians, Dusty, possess a vast store of politeness. These are people who get asked regularly the dumbest questions on God\'s green earth. These people tolerate every kind of crank and eccentric and mouth breather there is.', author: 'Garrison Keillor'});
quotes.push({quote: 'It is not the strongest or the most intelligent who will survive but those who can best manage change.', author: 'Charles Darwin'});
quotes.push({quote: 'The love for all living creatures is the most noble attribute of man.', author: 'Charles Darwin'});
quotes.push({quote: 'The cure for boredom is curiosity. There is no cure for curiosity.', author: 'Dorothy Parker'});
quotes.push({quote: 'This is not a novel to be tossed aside lightly. It should be thrown with great force.', author: 'Dorothy Parker'});
quotes.push({quote: 'Heterosexuality is not normal, it\'s just common.', author: 'Dorothy Parker'});

var randomInt = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

cdlaQuotes.factory('cdlaQuoter', function() {
  return {getRandomQuote: function() {
      var ri = randomInt(0, quotes.length - 1);
      return quotes[ri];
    }};
});
