import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentCurriculums } from './current-curriculums';

describe('CurrentCurriculums', () => {
  let component: CurrentCurriculums;
  let fixture: ComponentFixture<CurrentCurriculums>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrentCurriculums]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrentCurriculums);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
