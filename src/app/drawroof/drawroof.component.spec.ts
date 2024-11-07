import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawroofComponent } from './drawroof.component';

describe('DrawroofComponent', () => {
  let component: DrawroofComponent;
  let fixture: ComponentFixture<DrawroofComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrawroofComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrawroofComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
