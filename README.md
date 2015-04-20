# angular-countries-capitals
angularjs app which consumes geonames.org endpoints (JSON)

..this app is structured as follows:
<ul>
  <li> index.html uses ng-view to load partial views:
    <ul>
      <li> home.html: <br/>
          &emsp;<em>description of this app</em> </li>
      <li> countries.html (controller: AllCountriesCntrl) : <br/>
          &emsp;<em>displays table of countries, clicking on a country changes the URL to include ../CountryCode/CountryName </em> </li>
      <li> country.html (controller: OneCountryCntrl) : <br/>
          &emsp;<em>displays detail info on one country by resolving the URL route, e.g. ../CA/Canada </em> </li>
    </ul>
  </li>
  <li> ng-app uses ng-route as a dependency
    <ul> 
      <li> where routes include a Resolve method to pickup ../CountryCode/CountryName from the URL </li>
    </ul>
  </li>
  <li> One Factory added for $http requests to the geonames endpoints in JSON format</li>
  <li> Two Controllers use the data returned by the Factory </li>
  <li> One of these Controllers uses a Promise Chain (needed to pass Capital name of a country to a different search endpoint) </li>
