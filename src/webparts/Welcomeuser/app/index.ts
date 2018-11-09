import * as angular from "angular";
import WebPartService from "./WebPartService";
import UserProfileService from "./UserProfileService";
import WeatherService from "./WeatherService";
import MainController from "./MainController";
import MainTemplate from "./MainTemplate"; //const MainHtmlTemplate : string = require("./main.template.html");

const name: string = "noticeboard";
const app: ng.IModule = angular.module(name, []);

app
  .config(["$sceDelegateProvider", $sceDelegateProvider => { $sceDelegateProvider.resourceUrlWhitelist(["self", "**"]); }])
  .filter("trustedHtml", [ "$sce", $sce => { return (value, type) => { return $sce.trustAs(type||"html", value); }; } ])
  .service("$wp", WebPartService)
  .service("$usvc", UserProfileService)
  .service("$wsvc", WeatherService)
  .controller("mainController", MainController).component("main", { controller:"mainController", controllerAs:"vm", template:MainTemplate })
;

export default app;
