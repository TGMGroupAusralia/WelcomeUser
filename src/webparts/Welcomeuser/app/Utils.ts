import { SPComponentLoader } from '@microsoft/sp-loader';

export default class Utils {
  public static loadSP() : Promise<any> {
    var globalExportsName = null, p = null;
    var promise = new Promise<any>((resolve, reject) => {
      globalExportsName = '$_global_init'; p = (window[globalExportsName] ? Promise.resolve(window[globalExportsName]) : SPComponentLoader.loadScript('/_layouts/15/init.js', { globalExportsName }));
      p.catch((error) => { })
        .then(($_global_init): Promise<any> => {
          globalExportsName = 'Sys'; p = (window[globalExportsName] ? Promise.resolve(window[globalExportsName]) : SPComponentLoader.loadScript('/_layouts/15/MicrosoftAjax.js', { globalExportsName }));
          return p;
        }).catch((error) => { })
        .then((Sys): Promise<any> => {
          globalExportsName = 'SP'; p = ((window[globalExportsName] && window[globalExportsName].ClientRuntimeContext) ? Promise.resolve(window[globalExportsName]) : SPComponentLoader.loadScript('/_layouts/15/SP.Runtime.js', { globalExportsName }));
          return p;
        }).catch((error) => { })
        .then((SP): Promise<any> => {
          globalExportsName = 'SP'; p = ((window[globalExportsName] && window[globalExportsName].ClientContext) ? Promise.resolve(window[globalExportsName]) : SPComponentLoader.loadScript('/_layouts/15/SP.js', { globalExportsName }));
          return p;
        }).catch((error) => { })
        .then((SP): Promise<any> => {
          globalExportsName = 'SP.UserProfiles'; p = ((window[globalExportsName] && window[globalExportsName].ClientContext) ? Promise.resolve(window[globalExportsName]) : SPComponentLoader.loadScript('/_layouts/15/SP.UserProfiles.js', { globalExportsName }));
          return p;
        }).catch((error) => { })
        .then((SP) => {
          resolve(SP);
        })
      ;
    });
    return promise;
  }

  public static parseDate(value: any): Date {
    if (value instanceof Date) {
      return value;
    }
    var str = value.toISOString();
    var ret = new Date(str);
    return value;
  }
  

  public static getCurrentTimeByOffset(offset?: number): Date {
    var targetTime = new Date();
    if (isNaN(offset)) {
      offset = -(new Date().getTimezoneOffset() / 60); // get offset locally if configuration is not set
    }
    //get the timezone offset from local time in minutes
    var tzDifference = offset * 60 + targetTime.getTimezoneOffset();
    //convert the offset to milliseconds, add to targetTime, and make a new Date
    var offsetTime = new Date(targetTime.getTime() + tzDifference * 60 * 1000);

    return offsetTime;
  }
}
