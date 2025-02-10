import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import { ModalComponent } from './dialog';
import { AggridComponent } from './aggrid/aggrid.component';


@Component({
  selector: 'app-root',
  imports: [ MatSlideToggleModule, ModalComponent, AggridComponent
    ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
})
export class AppComponent {
  title = 'test';
}
