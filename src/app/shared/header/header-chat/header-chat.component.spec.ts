import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderCHatComponent } from './header-chat.component';

describe('HeaderCHatComponent', () => {
  let component: HeaderCHatComponent;
  let fixture: ComponentFixture<HeaderCHatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderCHatComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HeaderCHatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
