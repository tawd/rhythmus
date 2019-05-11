export default {
    baseURL:"",
    apiKey:"",
    uid:"",
    authKey:"",

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
            if(parsedConfig && parsedConfig.uid) {
                this.uid = parsedConfig.uid;
            }
            this.authKey="k="+Buffer.from(this.uid + ":" + this.apiKey).toString('base64');
        }
    }
}