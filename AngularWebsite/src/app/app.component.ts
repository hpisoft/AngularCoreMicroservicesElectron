import { Component, OnInit } from '@angular/core';
import { ShapesService } from './shapes.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ShapesService]
})

export class AppComponent implements OnInit {
    title = 'app';
    shapes: string[] = [];

    constructor(private shapesService: ShapesService) { }

    ngOnInit(): void {
        this.shapesService.getShapes().subscribe(shapes => this.shapes = shapes);
    }
}
