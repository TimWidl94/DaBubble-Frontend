import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewEmojiComponent } from './new-emoji.component';

describe('NewEmojiComponent', () => {
  let component: NewEmojiComponent;
  let fixture: ComponentFixture<NewEmojiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewEmojiComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewEmojiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
