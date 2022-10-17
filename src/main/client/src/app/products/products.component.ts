import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProductOrder } from '../models/product-order.model';
import { ProductOrders } from '../models/product-orders.model';
import { Product } from '../models/product.model';
import { ApiService } from '../services/api.service';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  productOrders: ProductOrder[] = [];
  products: Product[] = [];
  selectedProductOrder!: ProductOrder;
  private shoppingCartOrders!: ProductOrders;
  sub!: Subscription;
  productSelected: boolean = false;

  constructor(private Api: ApiService, private cartService: CartService) { }

  ngOnInit(): void {
    this.productOrders = [];
    this.loadProducts();
    this.loadOrders();
  }

  loadProducts() {
    this.Api.getAllProducts()
      .subscribe(
        (products: any) => {
          this.products = products;
          this.products.forEach(product => {
            this.productOrders.push(new ProductOrder(product, 0));
          })
        }
      );
  }

  loadOrders() {
    this.sub = this.Api.OrdersChanged.subscribe(() => {
      this.shoppingCartOrders = this.Api.ProductOrders;
    });
  }

  addToCart(order: ProductOrder): void {

    //console.log(`addToCart ${order.product.name} - ${order.product.price} x ${order.quantity}`);
    this.productSelected = true;
    this.Api.SelectedProductOrder = order;
    this.cartService.addToCart(order);
    // this.selectedProductOrder = this.Api.SelectedProductOrder;

  }

  private getProductIndex(product: Product): number {
    return this.Api.ProductOrders.productOrders
      .findIndex(value => value.product === product);
  }

  isProductSelected(product: Product): boolean {
    //console.log(product);
    return this.getProductIndex(product) > -1;
  }

  removeFromCart(productOrder: ProductOrder): void {
    let index = this.getProductIndex(productOrder.product);
    if (index > -1) {
      this.shoppingCartOrders.productOrders.splice(
        this.getProductIndex(productOrder.product), 1);
    }
    this.Api.ProductOrders = this.shoppingCartOrders;
    this.shoppingCartOrders = this.Api.ProductOrders;
    this.productSelected = false;

  }

  reset(): void {
    this.productOrders = [];
    this.loadProducts();
    this.Api.ProductOrders.productOrders = [];
    this.loadOrders();
    this.productSelected = false;
  }

}
