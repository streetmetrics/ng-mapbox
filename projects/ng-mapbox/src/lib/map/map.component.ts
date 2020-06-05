import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'lib-map',
  template: '<div #container><ng-content select="[map-content]"></ng-content></div>',
})
export class MapComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
