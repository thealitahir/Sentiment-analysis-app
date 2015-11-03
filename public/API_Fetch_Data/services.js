/**
 * Created by saman on 1/31/2015.
 */


angular.module('services').factory('CRUDService',['$http','$routeParams', function ($http, $routeParams) {

    return{

        fetchData: function(){

            var link = '/fetchData'
            return $http.get(link);
        },
        saveHashTag:function(tags){
            var link = '/saveHashTag'
            return $http.post(link,{tags:tags});
    }
    }
}]);
