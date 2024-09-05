import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreadReactionBoxComponent } from './thread-reaction-box.component';

describe('ThreadReactionBoxComponent', () => {
  let component: ThreadReactionBoxComponent;
  let fixture: ComponentFixture<ThreadReactionBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThreadReactionBoxComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ThreadReactionBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
