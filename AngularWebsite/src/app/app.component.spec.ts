import { TestBed, async, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AppComponent } from './app.component';
import { BackendEndpointsService } from './shared/backend-endpoints.service';

describe('AppComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                HttpClientTestingModule
            ],
            declarations: [
                AppComponent
            ],
            providers: [
                BackendEndpointsService
            ]
        }).compileComponents();
    }));

    it('should create the app', async(() => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    }));

    it(`should have as title 'app'`, async(() => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app.title).toEqual('app');
    }));

    it('should render title in a h1 tag', async(() => {
        const fixture = TestBed.createComponent(AppComponent);
        fixture.detectChanges();
        const compiled = fixture.debugElement.nativeElement;
        expect(compiled.querySelector('h1').textContent).toContain('Welcome to app!');
    }));

    it('should retrieve all shapes', async(inject([HttpTestingController, BackendEndpointsService], (httpMock: HttpTestingController, backedEndpointService: BackendEndpointsService) => {
        const fixture = TestBed.createComponent(AppComponent);
        fixture.detectChanges();

        const shapesApiEndpoint = backedEndpointService.getApiEndpoint("shapesApi");

        const request = httpMock.expectOne(shapesApiEndpoint + "api/shapes");
        request.flush(["MockedRectangle", "MockedSquare"]);

        const app = fixture.debugElement.componentInstance;
        expect(app.shapes.length).toEqual(2)

        httpMock.verify();
    })));
});
