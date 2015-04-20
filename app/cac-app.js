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
			getAllCountries: function() {
				return $http.get(apiCountries, {cache: true})
					.then(function(countries) {
						return countries.data.geonames;		//this further refines the response data
				});
			},
			getCountry: function(countryCode, country) {
				return $http.get(apiCountries + "&q=" + country + "&country=" + countryCode, {cache: true})
					.then(function(country) {
						return country.data.geonames[0];	//this further refines the response data
				});
			},
			getCapital: function(countryCode, country, capital) {
				return $http.get(apiCapitals + "&q=" + country + "&country=" + countryCode + "&name_equals=" + capital, {cache: true})
					.then(function(capital) {
						return capital.data.geonames[0];	//this further refines the response data
				});
			},
			getNeighbors: function(countryCode) {
				return $http.get(apiNeighbors + "&country=" + countryCode, {cache: true})
					.then(function(neighbors) {
						return neighbors.data.geonames;		//this further refines the response data
				});
			}

		}

		return exports;

	}) //end of Factory

	.controller('HomeCtrl', function($scope){
		$scope.home = "home controller description goes here..";
	}) // end of HomeCtrl Controller

	.controller('AllCountriesCtrl', function($scope, GeonamesFactory){
		GeonamesFactory.getAllCountries().then(function (countries) {
			$scope.countries = countries;
		});	
	}) // end of AllCountriesCtrl Controller

	.controller('OneCountryCtrl', function($scope, countryCode, country, GeonamesFactory){

		$scope.country = country;				//using this from the resolved route
		$scope.countryCode = countryCode;		//using this from the resolved route
	
		var loadCountry = function ()			//the following uses our Factory data
			{
				return GeonamesFactory.getCountry(countryCode, country)
					.then(function (country) {
						$scope.countryPopulation = country.population;
						$scope.countryArea = country.areaInSqKm;
						$scope.countryCapital = country.capital;
					});
			},
			loadNeighbors = function ()
			{
				return GeonamesFactory.getNeighbors(countryCode)
					.then(function (neighbors) {
						$scope.neighbors = neighbors;
						$scope.neighborCount = neighbors.length;
					});
			},
			loadCapital = function ()
			{
				return GeonamesFactory.getCapital(countryCode, country, $scope.countryCapital)
					.then(function (capital) {
						$scope.capitalPopulation = capital.population;
					});
			};


		loadCountry().then(loadNeighbors).then(loadCapital);	//promise chain!
		

	}); // end of OneCountryCtrl Controller and App
