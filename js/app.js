requirejs.config({
  "baseUrl": "js/lib",
  "paths": {
    "app": "../app",
    "ds-neue": "../../ds-neue/pattern-library/neue.js",
    "jquery": "http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min",
  },
  shim: {
    'ds-neue': {
      deps: ['jquery']
    },
    'app': {
      deps: ['jquery']
    }
  }
});

requirejs(["app/main"]);
