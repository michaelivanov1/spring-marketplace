import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmersProfileComponent } from './farmers-profile.component';

describe('FarmersProfileComponent', () => {
  let component: FarmersProfileComponent;
  let fixture: ComponentFixture<FarmersProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FarmersProfileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FarmersProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
