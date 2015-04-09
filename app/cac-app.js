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
	.factory('GeoAllCountries', function($http){
		
		var userName = "sabbasi";
		var urlAllCountries = "http://api.geonames.org/countryInfo?type=JSON&" + "username=" + userName;

		return $http.get(urlAllCountries);

	}) //end of Factory

	.factory('GeoOneCountry', function($http){
		
		var userName = "sabbasi";
		var urlOneCountry = "http://api.geonames.org/search?type=JSON" + "&username=" + userName;

		var GeoOneCountry = {
			findCountry: function(country, capital) {
				return $http.get(urlOneCountry + "&q=" + country + "&name=" + capital + "&isNameRequired=true");
			}
		};

		return GeoOneCountry;
		//return $http.get(urlOneCountry);

	}) //end of Factory

	.controller('HomeCtrl', function($scope){
		console.log("home controller");

	})
	.controller('AllCountriesCtrl', function($scope, GeoAllCountries){
		GeoAllCountries.success(function(response){
			$scope.countries = response.geonames;
		});
		
	})
	.controller('OneCountryCtrl', function($scope, country, capital, GeoOneCountry){
		$scope.country = country;
		$scope.capital = capital;
		GeoOneCountry.findCountry(country, capital).success(function(response){
			$scope.oneCountry = response.geonames;
			console.log($scope.oneCountry);
		});
	});
