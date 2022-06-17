import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolotnoComponent } from './polotno.component';

describe('PolotnoComponent', () => {
  let component: PolotnoComponent;
  let fixture: ComponentFixture<PolotnoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PolotnoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PolotnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
