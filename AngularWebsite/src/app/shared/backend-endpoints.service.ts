declare var electron: any;

import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";

@Injectable()
export class BackendEndpointsService {

    readonly ELECTRON_HOST: string = "http://localhost";
    readonly ELECTRON_METHOD_NAME: string = "GetPort";

    apis: { [name: string]: { host: string, port: number} } = {};
    
    constructor() {
        this.tryGetApisFromEnvironment();

        if (this.isElectronAvailable())
            this.setApisFromElectron();
    }

    private tryGetApisFromEnvironment() {
        if (environment && environment.apis)
            this.apis = environment.apis;
    }

    private isElectronAvailable(): boolean {
        return electron !== null && electron !== undefined;
    }

    private setApisFromElectron(): void {
        for (let apiName in this.apis) {
            if (this.apis.hasOwnProperty(apiName))
                this.setApiFromElectron(apiName);
        }
    }

    private setApiFromElectron(apiName: string) {
        let port = electron.ipcRenderer.sendSync(this.ELECTRON_METHOD_NAME, apiName);

        if (this.isInt(port)) {
            this.apis[apiName].host = this.ELECTRON_HOST;
            this.apis[apiName].port = parseInt(port);
        }
    }

    private isInt(value): boolean {
        return !isNaN(parseInt(value));
    }

    getApiEndpoint(apiName: string): string {
        if (!this.apis.hasOwnProperty(apiName))
            return "";

        let api = this.apis[apiName];

        return api.host + ":" + api.port + "/";
    }
}
