import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiaryCardComponent } from './diary-card.component';

describe('DiaryCardComponent', () => {
  let component: DiaryCardComponent;
  let fixture: ComponentFixture<DiaryCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiaryCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DiaryCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
