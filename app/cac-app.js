angular.module('CaCApp', ['ngRoute'])

	.config(function($routeProvider){
		$routeProvider.
			when('/', {
			templateUrl : 'home.html',
			controller : 'HomeCtrl'
		}).when('/countries', {
			templateUrl : 'countries.html',
			controller : 'AllCountriesCtrl'
		}).when('/countries/:countryCode/:country', {
			templateUrl : 'country.html',
			controller : 'OneCountryCtrl',
			resolve : {
				countryCode: function($route, $location) {
					var countryCode = $route.current.params.countryCode;
					return countryCode;
				},
				country: function($route, $location) {
					var country= $route.current.params.country;
					return country;
				}
			}
		}).otherwise({
			redirectTo : '/'
		}); 
	}) // end of config

	.factory('GeonamesFactory', function($http){
		
		var userName = "sabbasi";
		var apiCountries = "http://api.geonames.org/countryInfo?type=JSON" + "&username=" + userName;
		var apiCapitals = "http://api.geonames.org/search?type=JSON" + "&username=" + userName;
		var apiNeighbors = "http://api.geonames.org/neighbours?type=JSON" + "&username=" + userName;
		var exports = {};

		exports = {
			findAllCountries: function() {
				return $http.get(apiCountries, {cache: true});
			},
			findOneCountry: function(countryCode, country) {
				return $http.get(apiCountries + "&q=" + country + "&country=" + countryCode, {cache: true});
			},
			findCapital: function(countryCode, country, capital) {
				return $http.get(apiCapitals + "&q=" + country + "&country=" + countryCode + "&name_equals=" + capital, {cache: true});
			},
			findNeighbors: function(countryCode) {
				return $http.get(apiNeighbors + "&country=" + countryCode, {cache: true});
			}

		}

		return exports;

	}) //end of Factory

	.controller('HomeCtrl', function($scope){
		$scope.home = "home controller description goes here..";
	}) // end of HomeCtrl Controller

	.controller('AllCountriesCtrl', function($scope, GeonamesFactory){
		GeonamesFactory.findAllCountries().success(function(response){
			$scope.countries = response.geonames;
		});	
	}) // end of AllCountriesCtrl Controller

	.controller('OneCountryCtrl', function($scope, countryCode, country, GeonamesFactory){

		$scope.country = country;
		var countryCapital = [''];

		GeonamesFactory.findOneCountry(countryCode, country).success(function(response){
			$scope.countryPopulation = response.geonames[0].population;
			$scope.countryArea = response.geonames[0].areaInSqKm;
			$scope.countryCapital = response.geonames[0].capital;
			countryCapital[0] = $scope.countryCapital;
			console.log("capital inside: " + countryCapital[0]);
			
		});
			console.log("capital outside country: " + countryCapital[0]);
		GeonamesFactory.findCapital(countryCode, country, countryCapital).success(function(response){
			$scope.capitalPopulation = response.geonames[0].population;
		});

		GeonamesFactory.findNeighbors(countryCode).success(function(response){
			$scope.neighbors = response.geonames;
			console.log(response.geonames);
		});
	}); // end of OneCountryCtrl Controller and App
