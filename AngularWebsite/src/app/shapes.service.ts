import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";

import { BackendEndpointsService } from './shared/backend-endpoints.service';

@Injectable()
export class ShapesService {

    serviceEndpoint: string = "";

    constructor(private backendEnpointsService: BackendEndpointsService, private http: HttpClient) {
        this.serviceEndpoint = this.backendEnpointsService.getApiEndpoint("shapesApi");
    }

    getShapes(): Observable<string[]> {
        return this.http.get<string[]>(this.serviceEndpoint + "api/shapes");
    }
}
