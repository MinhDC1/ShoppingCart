import { Component, OnInit } from '@angular/core';
import { ProductOrder } from '../models/product-order.model';
import { ProductOrders } from '../models/product-orders.model';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  orders!: ProductOrders
  totalPrice: number = 0;
  cartCount: number = 0;

  constructor(private cartService: CartService) {
    this.cartService.cartDataObs$.subscribe((orders) => {
      this.orders = orders;
      this.cartCount = this.getCartCount(this.orders);
      this.totalPrice = this.getCartTotalPrice(this.orders);

     // console.log(orders);
    });
   }

  ngOnInit(): void {
  }

  addToCart(order: ProductOrder) {
    this.cartService.addToCart(order);
  }

  updateCart(id: number, quantity: number): void {
   // console.log( "updateCart", id, quantity );
    this.cartService.updateCart(id, quantity);
  }

  removeCartItem(id: number) {
    this.cartService.removeProduct(id);
  }

  getCartCount(productOrders: ProductOrders): number {
    let totalSum = 0;
    let prodOrders = productOrders;
    prodOrders.productOrders.forEach(
      (prodOrder) => (totalSum += prodOrder.quantity)
    );

    return totalSum;
  }

  getCartTotalPrice(prodOrders: ProductOrders): number {
    let totalSum = 0;
    prodOrders.productOrders.forEach(
      (prod) => (totalSum += prod.product.price * prod.quantity)
    );

    return totalSum;
  }


}
