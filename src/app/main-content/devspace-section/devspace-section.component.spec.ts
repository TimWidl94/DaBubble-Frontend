import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevspaceSectionComponent } from './devspace-section.component';

describe('DevspaceSectionComponent', () => {
  let component: DevspaceSectionComponent;
  let fixture: ComponentFixture<DevspaceSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DevspaceSectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DevspaceSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
