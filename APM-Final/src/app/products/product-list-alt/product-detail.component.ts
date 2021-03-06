import { Component, ChangeDetectionStrategy } from '@angular/core';

import { combineLatest, of } from 'rxjs';
import { catchError, map, filter } from 'rxjs/operators';

import { ProductService } from '../product.service';
import { Product } from '../product';

@Component({
  selector: 'pm-product-detail',
  templateUrl: './product-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailComponent {
  errorMessage = '';

  // Product to display
  product$ = this.productService.selectedProduct$;


  // Set the page title
  pageTitle$ = this.product$
    .pipe(
      map((p: Product) =>
        p ? `Product Detail for: ${p.productName}` : null)
    );

  // Suppliers for this product
  productSuppliers$ = this.productService.selectedProductSuppliers$
    .pipe(
      catchError(err => {
        this.errorMessage = err;
        return of(null);
      }));

  // Create a combined stream with the data used in the view
  // Use filter to skip if the product is null
  vm$ = combineLatest([
    this.product$,
    this.productSuppliers$,
    this.pageTitle$
  ])
    .pipe(
      filter(([product]) => !!product),
      map(([product, productSuppliers, pageTitle]) =>
        ({ product, productSuppliers, pageTitle }))
    );

  constructor(private productService: ProductService) { }

}
