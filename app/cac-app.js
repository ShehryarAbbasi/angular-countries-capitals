angular.module('CaCApp', ['ngRoute'])
	.config(function($routeProvider){
		$routeProvider.
			when('/', {
			templateUrl : 'home.html',
			controller : 'HomeCtrl'
		}).when('/countries', {
			templateUrl : 'countries.html',
			controller : 'CountriesCtrl'
		}).otherwise({
			redirectTo : '/'
		});

	}) // end of config
	.service('geoService', function($http){
		
		var userName = "sabbasi"
		var url = "http://api.geonames.org/countryInfo?type=JSON&" + "username=" + userName;
		
		return $http.get(url);


	}) //end of Service

	.controller('HomeCtrl', function($scope){
		console.log("home controller");

	})
	.controller('CountriesCtrl', function($scope, geoService){
		geoService.then(function(response){
			$scope.countries = response.data.geonames;
		});
		

	});
