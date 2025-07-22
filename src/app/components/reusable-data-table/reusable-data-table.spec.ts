import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReusableDataTable } from './reusable-data-table';

describe('ReusableDataTable', () => {
  let component: ReusableDataTable;
  let fixture: ComponentFixture<ReusableDataTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReusableDataTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReusableDataTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
