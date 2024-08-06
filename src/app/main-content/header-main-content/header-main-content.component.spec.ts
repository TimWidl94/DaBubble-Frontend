import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderMainContentComponent } from './header-main-content.component';

describe('HeaderMainContentComponent', () => {
  let component: HeaderMainContentComponent;
  let fixture: ComponentFixture<HeaderMainContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderMainContentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HeaderMainContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
