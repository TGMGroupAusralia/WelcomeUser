import IWebPartService from './WebPartService';
import Utils from "./Utils";

export interface IUserProfile {
  firstName: string;
  lastName?: string;
  UserProfileProperties: Array<any>;
  Email: string;
  WorkPhone: string;
  DisplayName: string;
  Department: string;
  PictureUrl: string;
  Title: string;
  OfficeLocation: string;
  Office: string;
  Country: string;
  time: Date;
  LocLat: string;
  LocLong: string;
  LocError: string;
  LocName: string;
}

export interface IUserProfileService {
  getUserProfile(utcOffset?: number): ng.IPromise<IUserProfile>;
}

export default class DataService implements IUserProfileService {
  public static $inject: string[] = ["$q", "$wp"];
  constructor(private $q: ng.IQService, private $wp: IWebPartService) {}

  public getUserProfile(utcOffset?: number): ng.IPromise<IUserProfile> {
    return this.$q((resolve, reject) => {
      var webUrl: string = (this.$wp.context ? this.$wp.context.pageContext.web.absoluteUrl : ''), webServerRelativeUrl: string = (this.$wp.context ? this.$wp.context.pageContext.web.serverRelativeUrl : '');
      var ret = {} as IUserProfile;
      ret.LocLat = "-37.8136";
      ret.LocLong = "144.9631";
      function onSuccess(position) {
        ret.LocLat = position.coords.latitude;
        ret.LocLong = position.coords.longitude;
      }
      function onError(error) {
        console.error('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
              ret.LocError = "Location Disabled";
      }
      navigator.geolocation.getCurrentPosition(onSuccess, onError);

      Utils.loadSP().then(() => {
        var context: SP.ClientContext = new SP.ClientContext(webUrl); //this.context.pageContext.web.absoluteUrl
        var peopleManager = new SP.UserProfiles.PeopleManager(context);
        var myProperties = peopleManager.getMyProperties();
        context.load(myProperties, "UserProfileProperties");
        context.executeQueryAsync(() => {
          var extendedProperties = myProperties.get_userProfileProperties();
          var size = 'L';
          var accountName = extendedProperties.AccountName; if (!/[:|]/i.test(accountName)) { accountName = "i:0#.f|membership|"+accountName; }
          var profileUrl = `${webUrl}/_layouts/15/userphoto.aspx?size=${size}&accountname=${encodeURIComponent(accountName)}`;
          ret.firstName = extendedProperties.FirstName,
          ret.Office = extendedProperties.Office,
          ret.PictureUrl = profileUrl;
          ret.time = Utils.getCurrentTimeByOffset(utcOffset);
          resolve(ret);
        }, (sender, args) => {
            var error = args.get_message();
            reject(error);
        });
      }, () => { reject('Could not load SP dependencies.'); });   
    });
  }
}
