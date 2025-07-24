import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReusableTableHeader } from './reusable-table-header';

describe('ReusableTableHeader', () => {
  let component: ReusableTableHeader;
  let fixture: ComponentFixture<ReusableTableHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReusableTableHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReusableTableHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
