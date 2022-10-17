import { Component, OnInit } from '@angular/core';
import { Product } from '../models/product.model';
import { CartService } from '../services/cart.service';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  loading = false;

  constructor(private productService: ProductService,
    private cartService: CartService) { }

  ngOnInit(): void {
    // this.loading = true;
    // setTimeout(() => {
    //   this.productService.getAllProducts().subscribe(
    //     (result:any) => {
    //       console.log(result);
    //       this.products = result;
    //       this.loading = false;
    //     },
    //     (error) => {
    //       console.error(error);
    //       this.loading = false;
    //     }
    //   );

    // }, 500);
  }

}
