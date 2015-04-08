Cedilla UI is a reference consumer for the [Cedilla project](https://github.com/cdlib/cedilla).

#### Build Status:
[![Build Status](https://secure.travis-ci.org/cdlib/cedilla_ui.png?branch=master)](http://travis-ci.org/cdlib/cedilla_ui)

#### About Cedilla UI

Cedilla UI is a patron interface for data aggregated by the [Cedilla aggregator](https://github.com/cdlib/cedilla). 
It provides direct linking to resource for a bibliographic citation, and directs users to other options for getting electronic resources 
or holdings in their library.

Cedilla UI is a single-page Javascript, AngularJS application that communicates with the Cedilla aggregator using [socket.io](http://socket.io).
It is dependent on a Cedilla aggregator for data, but itself has no server component and can be served up using any web server.

#### Installation

Cedilla UI depends on node.js (for package management using npm), Bower, Grunt, and Compass (a Ruby gem). To install the project:

1. clone this project
1. npm install -g bower
1. npm install -g grunt
1. npm install -g grunt-cli
1. gem install compass
1. cd to cedilla_ui project dir
1. npm install
1. bower install
1. cp app/scripts/config.example app/scripts/config.js
1. edit app/scripts/config.js to provide the address of your Cedilla aggregator instance
1. grunt test
1. grunt serve

#### Protractor tests

Because the webdriver server running the Protractor (Selenium) tests would need to connect to an aggregator 
it is impractical to run the tests in Travis.

The protractor tests can be run from the Cedilla UI project using the commands:

grunt serve &

grunt protractor:run

### License

The Cedilla UI project adheres to the [BSD 3 Clause](./LICENSE.md) license agreement.



