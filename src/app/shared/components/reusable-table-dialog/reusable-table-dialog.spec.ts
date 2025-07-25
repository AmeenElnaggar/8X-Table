import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReusableTableDialog } from './reusable-table-dialog';

describe('ReusableTableDialog', () => {
  let component: ReusableTableDialog;
  let fixture: ComponentFixture<ReusableTableDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReusableTableDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReusableTableDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
