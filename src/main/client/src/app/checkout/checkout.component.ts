import { Component, OnInit } from '@angular/core';
import { ProductOrders } from '../models/product-orders.model';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  orders!: ProductOrders
  totalPrice: number = 0;
  cartCount: number = 0;

  currentStep = 1;
  loading = false;

  constructor(private cartService: CartService) {
    this.cartService.cartDataObs$.subscribe((orders) => {
      this.orders = orders;
      this.cartCount = this.getCartCount(this.orders);
      this.totalPrice = this.getCartTotalPrice(this.orders);

      console.log(orders);
    });
   }

  ngOnInit(): void {
  }

  submitCheckout() {
    this.loading = true;
    setTimeout(() => {
      this.cartService
        .submitCheckout(this.orders)
        .subscribe({
          next: (res: any) => {
            //console.log(res);
            this.loading = false;
            this.currentStep = 2;
            this.cartService.clearCart();
          },
          error: (err) => {
            //console.log(err);
            this.loading = false;
          }
        });
    }, 750);
  }

  getProgressPrecent() {
    return (this.currentStep / 2) * 100;
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
