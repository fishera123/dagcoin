(() => {
  'use strict';

  /**
   * @desc Transactions table
   * @example <dag-transactions-table></dag-transactions-table>
   */
  angular
    .module('copayApp.directives')
    .directive('dagTransactionsTable', dagTransactionsTable);

  dagTransactionsTable.$inject = [];

  function dagTransactionsTable() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'directives/dagTransactionsTable/dagTransactionsTable.template.html',
      scope: {},
      link: () => {

      }
    };
  }
})();
