angular.module('CaCApp', ['ngRoute'])

	.config(function($routeProvider){
		$routeProvider.
			when('/', {
			templateUrl : 'home.html',
			controller : 'HomeCtrl'
		}).when('/countries', {
			templateUrl : 'countries.html',
			controller : 'AllCountriesCtrl'
		}).when('/countries/:country/:capital', {
			templateUrl : 'country.html',
			controller : 'OneCountryCtrl',
			resolve : {
				country: function($route, $location) {
					var country= $route.current.params.country;
					return country;
				},

				capital: function($route, $location) {
					var capital = $route.current.params.capital;
					return capital;
				}
			}
		}); 
	}) // end of config

	.factory('GeoFactory', function($http){
		
		var userName = "sabbasi";
		var urlAllCountries = "http://api.geonames.org/countryInfo?type=JSON&" + "username=" + userName;
		var urlOneCountry = "http://api.geonames.org/search?type=JSON" + "&username=" + userName;
		var exports = {};

		exports = {
			findAllCountries: function() {
				return $http.get(urlAllCountries);
			},
			findOneCountry: function(country, capital) {
				return $http.get(urlOneCountry + "&q=" + country + "&name_equals=" + capital + "&isNameRequired=true");
			}
		}

		return exports;

	}) //end of Factory

	.controller('HomeCtrl', function($scope){
		$scope.home = "home controller description goes here..";
	}) // end of HomeCtrl Controller

	.controller('AllCountriesCtrl', function($scope, GeoFactory){
		GeoFactory.findAllCountries().success(function(response){
			$scope.countries = response.geonames;
		});	
	}) // end of AllCountriesCtrl Controller

	.controller('OneCountryCtrl', function($scope, country, capital, GeoFactory){
		$scope.country = country;
		$scope.capital = capital;
		GeoFactory.findOneCountry(country, capital).success(function(response){
			console.log(response.geonames);
			$scope.capitalPopulation = response.geonames[0].population;
		});
	}); // end of OneCountryCtrl Controller and App
