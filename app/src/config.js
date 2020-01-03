export default {
    baseURL:"",
    apiKey:"",
    my_teammate_id:"",
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
            if(parsedConfig && parsedConfig.my_teammate_id) {
                this.my_teammate_id = parsedConfig.my_teammate_id;
            }
            if(parsedConfig && parsedConfig.is_admin) {
                this.is_admin = true;
            }
            this.authKey="k="+Buffer.from(this.uid + ":" + this.apiKey).toString('base64');
        }
    }
}