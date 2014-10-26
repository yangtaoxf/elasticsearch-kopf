kopf.controller('GlobalController', ['$scope', '$location', '$timeout',
  '$http', '$q', '$sce', '$window', 'ConfirmDialogService', 'AlertService',
  'SettingsService', 'ThemeService', 'ElasticService', 'ClusterService',
  function($scope, $location, $timeout, $http, $q, $sce, $window,
           ConfirmDialogService, AlertService, SettingsService, ThemeService,
           ElasticService, ClusterService) {

    $scope.version = '1.3.8-SNAPSHOT';
    $scope.alert_service = AlertService;
    $scope.modal = new ModalControls();

    $scope.getTheme = function() {
      return ThemeService.getTheme();
    };

    $scope.readParameter = function(name) {
      var regExp = new RegExp('[\\?&]' + name + '=([^&#]*)');
      var results = regExp.exec($window.location.href);
      return isDefined(results) ? results[1] : null;
    };

    $scope.connect = function() {
      try {
        var host = 'http://localhost:9200'; // default
        if ($location.host() !== '') { // not opening from fs
          var location = $scope.readParameter('location');
          if (isDefined(location)) {
            host = location;
          } else {
            var url = $location.absUrl();
            host = url.substring(0, url.indexOf('/_plugin/kopf'));
          }
        }
        ElasticService.connect(host);
      } catch (error) {
        AlertService.error(error.message, error.body);
      }
    };

    $scope.connect();

    ClusterService.refresh();

    $scope.hasConnection = function() {
      return isDefined(ClusterService.clusterHealth);
    };

    $scope.displayInfo = function(title, info) {
      $scope.modal.title = title;
      $scope.modal.info = $sce.trustAsHtml(JSONTree.create(info));
      $('#modal_info').modal({show: true, backdrop: true});
    };

    $scope.getCurrentTime = function() {
      return getTimeString(new Date());
    };

  }
]);
