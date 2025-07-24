import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsDialog } from './products-dialog';

describe('ProductsDialog', () => {
  let component: ProductsDialog;
  let fixture: ComponentFixture<ProductsDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductsDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
