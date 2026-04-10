import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportCaseCardComponent } from './report-case-card.component';

describe('ReportCaseCardComponent', () => {
  let component: ReportCaseCardComponent;
  let fixture: ComponentFixture<ReportCaseCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportCaseCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportCaseCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
