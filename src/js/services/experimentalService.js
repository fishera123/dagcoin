/* eslint-disable import/no-unresolved */
(function () {
  'use strict';

  angular.module('copayApp.services').factory('experimentalService', () => {
    const root = {};

    const eventBus = require('byteballcore/event_bus.js');

    eventBus.on('dagcoin.experiment', () => {
      // Feel free to experiment
      console.log('TODO: DO SOMETHING IN THIS EXPERIMENT');
    });

    return root;
  });
}());
