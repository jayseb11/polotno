import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { App } from './polotno-js/app';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit{
  title = 'polotno-js';
  ngOnInit(): void {}

  public ngOnChanges() {
    this.renderComponent();
  }

  public ngAfterViewInit() {
    this.renderComponent();
  }

  private renderComponent() {
       ReactDOM.render(
        React.createElement(App) 
      ,document.getElementById('root')
      );
  }
}
