import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswortResetSendEmailComponent } from './passwort-reset-send-email.component';

describe('PasswortResetSendEmailComponent', () => {
  let component: PasswortResetSendEmailComponent;
  let fixture: ComponentFixture<PasswortResetSendEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswortResetSendEmailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PasswortResetSendEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
