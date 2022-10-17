import { Component, OnInit } from '@angular/core';
import { NzThMeasureDirective } from 'ng-zorro-antd/table';
import { ProductOrders } from '../models/product-orders.model';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isMenuOpen = false;
  dropdownVisible = false;
  orders!: ProductOrders;
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

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
  }

  removeProductFromCart(id: number) {
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

  reset() {
    // this.orderFinished = false;
    // this.productsC.reset();
    // this.shoppingCartC.reset();
    // this.ordersC.paid = false;
  }

}
