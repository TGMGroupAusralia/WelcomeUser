import { IUserProfileService, IUserProfile, } from "./UserProfileService";
import { IWeatherService, IWeatherDetails, } from "./WeatherService";
import { IWebPartConfiguration, } from "../IWebPartConfiguration";
import { IWebPartService } from "./WebPartService";
import { IWebPartContext } from "@microsoft/sp-webpart-base";

export default class MainController implements ng.IController {
  protected isLoadingQ: boolean;
  protected config: IWebPartConfiguration;
  protected userProfile: IUserProfile;
  protected weatherDetails: IWeatherDetails;
  protected officeLocation: string;

  public static $inject: string[] = [ "$window", "$rootScope", "$rootElement", "$scope", "$element", "$q", "$usvc", "$wsvc", "$wp", "$sce" ];
  constructor(private $window: ng.IWindowService, private $rootScope: ng.IRootScopeService, private $rootElement: ng.IRootElementService, private $scope: ng.IScope, private $element: JQuery, private $q: ng.IQService, private $usvc: IUserProfileService, private $wsvc: IWeatherService, private $wp: IWebPartService, private $sce: ng.ISCEService) {
    $rootScope.$on("webpart-configuration-loaded", (event: ng.IAngularEvent, config?: IWebPartConfiguration): void => {
      this.config = config;
      this.init();
    });
    this.init();
  }

  public $onInit() { }

  private init(): void {
    this.loadUserProfileAndWeather();
  }

  private loadUserProfileAndWeather(): void {
    this.isLoadingQ = true;
    this.$q((resolve, reject) => {
      this.$usvc.getUserProfile(this.$wp.config.utcOffset).then((userProfile: IUserProfile): void => {
        this.userProfile = userProfile;

        var country = this.$wp.config.country||'Australia';
        var userOffice = this.userProfile.Office||""; // Get office location from userprofileproperties array
        this.officeLocation = (this.$wp.config.officeLocation ? this.$wp.config.officeLocation : '') || userOffice;

        this.$wsvc.getWeatherDetails(this.userProfile.LocLat, this.userProfile.LocLong).then((weatherDetails: IWeatherDetails): void => {
          this.weatherDetails = weatherDetails;
          if(this.weatherDetails.weatherName != ''){ this.officeLocation = this.weatherDetails.weatherName; }
        }, reject);
      }, reject);
    }).finally((): void => {
      this.isLoadingQ = false;
    });
  }

  public getProfilePhotoStyle() {
    var ret = {};
    if (this.userProfile && this.userProfile.PictureUrl) { ret["background-image"] = this.$sce.getTrustedResourceUrl(`url(${this.userProfile.PictureUrl})`); }
    return ret;
  }
  public getWeatherStyle() {
    var ret = {};
    if (this.weatherDetails && this.weatherDetails.weatherIcon) { ret["background-image"] = this.$sce.getTrustedResourceUrl(`url(${this.weatherDetails.weatherIcon})`); }
    return ret;
  }
  public getUserStyles() {
    var ret = {};
    if (this.config.bgColor) { ret["background-color"] = this.config.bgColor; }
    if (this.config.fontColor) { ret["color"] = this.config.fontColor; }
    return ret;
  }
}
