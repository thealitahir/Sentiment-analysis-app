
var StudentApp;
StudentApp = angular.module('StudentApp',
    [
        'ui.router',
        'ui.bootstrap',
        'ngRoute',
        'APIFetchController',
        'services',
        'filters',
        'directives',
        "highcharts-ng",
        'angularjs-dropdown-multiselect',
        'easypiechart'
    ])

    .run(
    [          '$rootScope', '$state', '$stateParams',
        function ($rootScope, $state, $stateParams) {

            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;

        }
    ])
    .config(['$stateProvider', '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {

            $urlRouterProvider.otherwise("/sentiment_analysis");

            $stateProvider

                .state("API_Data", {
                    url: "/sentiment_analysis",
                    templateUrl: 'view/Demo.html',
                    controller: 'DemoController'

                })
        }]);

angular.module('StudentApp.controllers',['ui.router']);
angular.module('services',[]);
angular.module('filters',[]);
angular.module('directives',[]);
angular.module('StudentApp.controllers',['highcharts-ng']);
