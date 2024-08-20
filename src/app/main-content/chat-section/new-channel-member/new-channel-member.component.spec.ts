import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewChannelMemberComponent } from './new-channel-member.component';

describe('NewChannelMemberComponent', () => {
  let component: NewChannelMemberComponent;
  let fixture: ComponentFixture<NewChannelMemberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewChannelMemberComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewChannelMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
