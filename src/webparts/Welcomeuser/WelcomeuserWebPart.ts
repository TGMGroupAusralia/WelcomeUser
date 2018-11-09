import { Version, Log } from "@microsoft/sp-core-library";
import { BaseClientSideWebPart, IPropertyPaneConfiguration, IWebPartContext, PropertyPaneToggle, PropertyPaneSlider, PropertyPaneTextField, IPropertyPaneCustomFieldProps, IWebPartPropertiesMetadata, PropertyPaneDropdown } from "@microsoft/sp-webpart-base";

//Imports custom Webpart Properties
import { IWebPartConfiguration } from "./IWebPartConfiguration";
//Imports property pane pnp custom fields
import { PropertyFieldColorPickerMini, IPropertyFieldColorPickerMiniProps, IPropertyFieldColorPickerMiniPropsInternal } from "sp-client-custom-fields/lib/PropertyFieldColorPickerMini";

import * as strings from "WelcomeuserWebPartStrings";

import * as ng from "angular";
import app from "./app";
import IWebPartService from "./app/WebPartService";

export default class WelcomeuserWebPart extends BaseClientSideWebPart<IWebPartConfiguration> {
  private $injector: ng.auto.IInjectorService;
  private get$rootScope(): ng.IRootScopeService {
    return this.$injector.get("$rootScope");
  }
  public render(): void {

    // load the Angular App on the webpart domElement
    if (this.renderedOnce === false) {
      // first time the webpart loaded
      app.run(["$wp", ($wp: IWebPartService) => { $wp.context = this.context; $wp.displayMode = this.displayMode; $wp.config = this.properties; }]);
      this.domElement.innerHTML = `<main></main>`;
      this.$injector = ng.bootstrap(this.domElement, [app.name]);
      this.get$rootScope().$broadcast('webpart-loaded', this.context, this.displayMode);
    }
    // 
    // every time the webpart loads (i.e. configuration changes)
    this.get$rootScope().$broadcast('webpart-configuration-loaded', this.properties);
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: { description: strings.PropertyPaneDescription },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyFieldColorPickerMini("bgColor", { key: "bgColorFieldId", label: "Background Color", initialColor: this.properties.bgColor, onPropertyChange: this.onPropertyPaneFieldChanged, render: this.render.bind(this), disableReactivePropertyChanges: this.disableReactivePropertyChanges, properties: this.properties, disabled: false, deferredValidationTime: 200, onGetErrorMessage: null }),
                PropertyFieldColorPickerMini("fontColor", { key: "fontColorFieldId", label: "Font Color", initialColor: this.properties.fontColor, onPropertyChange: this.onPropertyPaneFieldChanged, render: this.render.bind(this), disableReactivePropertyChanges: this.disableReactivePropertyChanges, properties: this.properties, disabled: false, deferredValidationTime: 200, onGetErrorMessage: null }),
                PropertyPaneTextField("country", { label: "Country" }),
                PropertyPaneTextField("officeLocation", { label: "Office Location" }),
                PropertyPaneToggle("useCustomOffset", { label: "Use a custom Time Offset" }),
                PropertyPaneSlider("utcOffset", { label: "UTC Time Offset", min: -12, max: 14, step: 1, showValue: true, disabled: !this.properties.useCustomOffset })
              ]
            }
          ]
        }
      ]
    };
  }
}
