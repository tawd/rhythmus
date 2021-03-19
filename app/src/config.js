export default {
    baseURL:"",
    apiKey:"",
    my_teammate_id:"",
    wp_uid:false,
    authKey:"",
    kraTopics:false,
    goalTopics:false,
    goalHelp:"",
    is_admin:false,
    my_kra:false,
    kraSections:3,

    monthNames: [ "January", "February", "March", "April", "May", "June", 
       "July", "August", "September", "October", "November", "December" ],

    weeklyReportStatus: ["Missing", "Done", "Out", "Late"],

    load: function() {
        const appConfig = document.getElementById('app-config');

        if(appConfig && appConfig.textContent){
            const parsedConfig = JSON.parse(appConfig.textContent);
            if(parsedConfig && parsedConfig.baseURL) {
                this.baseURL = parsedConfig.baseURL;
            }
            if(parsedConfig && parsedConfig.apiKey) {
                this.apiKey = parsedConfig.apiKey;
            }
            if(parsedConfig && parsedConfig.myTeammateId) {
                this.my_teammate_id = parsedConfig.myTeammateId;
            }
            if(parsedConfig && parsedConfig.wpUid) {
                this.wp_uid = parsedConfig.wpUid;
            }
            if(parsedConfig && parsedConfig.isAdmin) {
                this.isAdmin = true;
            }
            this.authKey="k="+Buffer.from(this.wpUid + ":" + this.apiKey).toString('base64');
        }
    }
}