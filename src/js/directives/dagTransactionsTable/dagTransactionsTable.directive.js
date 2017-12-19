(() => {
  'use strict';

  /**
   * @desc Transactions table
   * @example <dag-transactions-table></dag-transactions-table>
   */
  angular
    .module('copayApp.directives')
    .directive('dagTransactionsTable', dagTransactionsTable);

  dagTransactionsTable.$inject = ['moment', 'exportTransactions', 'isCordova', '$timeout', '$rootScope'];

  function dagTransactionsTable(moment, exportTransactions, isCordova, $timeout, $rootScope) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'directives/dagTransactionsTable/dagTransactionsTable.template.html',
      scope: {
        rows: '='
      },
      link: ($scope) => {
        const today = moment().format('DD/MM/YYYY');
        const yesterday = moment().subtract(1, 'day').format('DD/MM/YYYY');
        $scope.isCordova = isCordova;
        $scope.transactions = {};
        $scope.total_transactions = 0;
        $scope.visible_rows = 0;
        $scope.limit = 10;

        $scope.exportToCsv = () => {
          if (!$scope.exporting) {
            $scope.exporting = true;
            exportTransactions.toCSV().then(() => {
              $timeout(() => {
                $scope.exporting = false;
              }, 500);
            });
          }
        };

        $scope.openTransaction = (transaction) => {
          $rootScope.openTxModal(transaction, $scope.rows);
        };

        $scope.formatDate = (value) => {
          if (value === today) {
            return 'Today';
          } else if (value === yesterday) {
            return 'Yesterday';
          }
          return value;
        };

        $scope.transactionStatus = (transaction) => {
          if (!transaction.confirmations) {
            return { icon: 'autorenew', title: 'Pending' };
          }

          if (transaction.status === 'received') {
            return { icon: 'call_received', title: 'Received' };
          }
          return { icon: 'call_made', title: 'Sent' };
        };

        function filterRows() {
          $scope.transactions = {};

          for (let x = 0, maxLen = $scope.total_transactions; x < maxLen; x += 1) {
            if (x <= $scope.limit) {
              const t = $scope.rows[x];
              console.log(t);
              if (!t.isFundingNodeTransaction) {
                const timestamp = t.time * 1000;
                const date = moment(timestamp).format('DD/MM/YYYY');

                if (!$scope.transactions[date]) {
                  $scope.transactions[date] = [];
                }

                $scope.transactions[date].push(t);
                $scope.visible_rows += 1;
              }
            }
          }
        }

        $scope.$watch('rows', () => {
          if ($scope.rows.length > 0) {
            $scope.total_transactions = $scope.rows.length;
            filterRows();
          } else {
            $scope.total_transactions = 0;
          }
        });

        $scope.increaseLimit = () => {
          $scope.limit += 10;
          filterRows();
        };
      }
    };
  }
})();
