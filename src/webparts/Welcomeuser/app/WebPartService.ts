import { IWebPartContext } from "@microsoft/sp-webpart-base";
import { Environment, EnvironmentType, DisplayMode } from "@microsoft/sp-core-library";
import { IWebPartConfiguration } from "../IWebPartConfiguration";

export interface IWebPartService {
  context?: IWebPartContext;
  displayMode?: DisplayMode;
  config?: IWebPartConfiguration;
  //
  isDisplayQ(): boolean;
  isEditQ(): boolean;
  isClassicQ(): boolean;
  isModernQ(): boolean;
  isWorkbenchQ(): boolean;
  isUnitTestQ(): boolean;
}

export default class WebPartService implements IWebPartService {
  public id?: string;
  public context?: IWebPartContext;
  public displayMode?: DisplayMode;
  public config?: IWebPartConfiguration;

  public static $inject: string[] = ["$rootScope"];
  constructor($rootScope: RootScopeSetting) {
    $rootScope.$on(
      "webpart-loaded",
      (
        event: ng.IAngularEvent,
        context?: IWebPartContext,
        displayMode?: DisplayMode
      ) => {
        if (context !== undefined) {
          this.context = context;
          this.id = context.instanceId;
        }
        if (displayMode !== undefined) {
          this.displayMode = displayMode;
        }
      }
    );
    $rootScope.$on(
      "webpart-configuration-loaded",
      (event: ng.IAngularEvent, config?: IWebPartConfiguration): void => {
        if (config !== undefined) {
          $rootScope.config = this.config = config;
        }
      }
    );
    //
    $rootScope.$wp = this;
    $rootScope.config = this.config;
    $rootScope.isDisplayQ = this.isDisplayQ;
    $rootScope.isEditQ = this.isEditQ;
    $rootScope.isClassicQ = this.isClassicQ;
    $rootScope.isModernQ = this.isModernQ;
    $rootScope.isWorkbenchQ = this.isWorkbenchQ;
    $rootScope.isUnitTestQ = this.isUnitTestQ;
  }

  public isDisplayQ(): boolean {
    return this.displayMode == DisplayMode.Read;
  }
  public isEditQ(): boolean {
    return this.displayMode == DisplayMode.Edit;
  }
  public isClassicQ(): boolean {
    return Environment.type == EnvironmentType.ClassicSharePoint;
  }
  public isModernQ(): boolean {
    return Environment.type == EnvironmentType.SharePoint;
  }
  public isWorkbenchQ(): boolean {
    return Environment.type == EnvironmentType.Local;
  }
  public isUnitTestQ(): boolean {
    return Environment.type == EnvironmentType.Test;
  }
  public updateConfiguration(configuration: IWebPartConfiguration) {}
}

export interface RootScopeSetting extends ng.IRootScopeService {
  $wp: any;
  config: any;
  isDisplayQ: any;
  isEditQ: any;
  isClassicQ: any;
  isModernQ: any;
  isWorkbenchQ: any;
  isUnitTestQ: any;
}
