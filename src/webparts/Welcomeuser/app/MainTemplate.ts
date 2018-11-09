import styles from "../WelcomeuserWebPart.module.scss"; import customFieldsStyles from "sp-client-custom-fields/lib/PropertyFields.module.scss";
export default `
<div id="{{vm.$wp.id}}" class="${styles.Welcomeuser}">
    <div class="${styles.Welcomeuser}" ng-show="vm.isLoadingQ">
        <div class="${styles.spinner}">
            <div class="${styles.spinnerCircle} ${styles.spinnerLarge}"></div>
            <div class="${styles.spinnerLabel}">Loading...</div>
        </div>
    </div>
    <div ng-if="vm.userProfile" ng-style="vm.getUserStyles()">
        <div class="${styles.profilePhoto}" ng-style="vm.getProfilePhotoStyle()"></div>
        <div class="${styles.whatsOn}">
            <div class="${styles.wpTitle}">
                {{ vm.userProfile.time.getHours() > 11 ? 'Good afternoon' : 'Good morning' }},
                <br> {{ vm.userProfile.firstName }}
            </div>
            <div class="${styles.officeLocation}">{{ vm.officeLocation }}:</div>
            <div style="display:table-row">
                <div class="${styles.sTime}" >
                    <div class="${styles.clockContainer}">
                        {{ vm.userProfile.time | date:'HH:mm' }}
                    </div>
                </div>
            </div
            <div style="display:table-row">
                <div class="${styles.sWeather}">
                    <div ng-style="vm.getWeatherStyle()" class="${styles.weatherContainer}">
                        {{ vm.weatherDetails.temperature }} <sup>&deg;</sup>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div>
    </div>
</div>
`;
