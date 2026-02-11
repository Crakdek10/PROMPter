import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {TitleBar} from '../../shared/components/title-bar/title-bar';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, TitleBar],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent {}
