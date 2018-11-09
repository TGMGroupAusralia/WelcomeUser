export interface IWeatherDetails {
  temperature: string;
  weatherIcon: string;
  weatherUrl: string;
  weatherName: string;
}

export interface IWeatherService {
  getWeatherDetails(lat: string, long: string): ng.IPromise<IWeatherDetails>;
}

export default class WeatherService implements IWeatherService {
  public static $inject: string[] = ["$q","$http"];
  constructor(private $q: ng.IQService, private $http: ng.IHttpService) {}

  public getWeatherDetails(lat: string, long: string): ng.IPromise<IWeatherDetails> {
    return this.$q((resolve, reject) => {
      // country = country||"au";
      var wUnits = 'metric';
      var wApikey = '752b8b702f22f2f745d39129227c0194';
      var ret = {} as IWeatherDetails;
      // console.log('Location ' + lat + ', ' + long);
      // var url: string = `https://api.openweathermap.org/data/2.5/weather?lat=-37.82&lon=145.04&appid=752b8b702f22f2f745d39129227c0194&units=metric`;
      var url: string = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${wApikey}&units=${wUnits}`;
      console.log('URL ' + url);
      var options = {method:'GET', url: url, contentType: "application/json; charset=utf-8" };

      this.$http(options).then((response) => {
        // console.log("****"+JSON.stringify(response.data));
        if (200 >= response.status && response.status >= 299) { reject('Invalid Response.'); return; }
        var data: any = (response ? response.data : null)||{};
        // var observation = data.weather[0].description;

        ret.weatherIcon = `http://openweathermap.org/img/w/${data.weather[0].icon}.png`; 
        ret.temperature = data.main.temp;
        ret.weatherUrl = "";
        ret.weatherName = data.name;
        // console.log("Name:"+data.name+"  IWeatherDetails:"+ret.weatherName);
        resolve(ret);
      }, (response) => {
        reject("ERROR");
      });
    });
  }
}
