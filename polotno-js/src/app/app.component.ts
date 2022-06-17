import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'polotno-js';
  constructor(private router: Router) {
    this.router.navigate(["home"]);
  }
  ngOnInit(): void { }

  public ngOnChanges() {
  }

  public ngAfterViewInit() {
  }



}