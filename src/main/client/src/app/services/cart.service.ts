import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiService } from './api.service';
import { stringToKeyValue } from '@angular/flex-layout/extended/style/style-transforms';
import { ProductOrder } from '../models/product-order.model';
import { ProductOrders } from '../models/product-orders.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  //orderFinished: boolean;
  orders!: ProductOrders;
  totalPrice!: number;
  sub!: Subscription;
  selectedProductOrder!: ProductOrder;

  // cartData = {
  //   orders: [],
  //   total: 0,
  // };

  //cartDataObs$ = new BehaviorSubject(this.cartData);
  cartDataObs$ = new BehaviorSubject(this.orders);

  constructor( private notification: NzNotificationService,
               private apiService: ApiService) {

    let localCartData = JSON.parse(localStorage.getItem('cart') as string);
    if (localCartData) {
      this.orders = localCartData;
    }
    else {
      this.orders = this.apiService.ProductOrders;
    }

    this.cartDataObs$.next(this.orders);

  }

  submitCheckout(orders: ProductOrders) {
    return this.apiService.saveOrder(orders);
  }

  private calculateTotalPrice(products: ProductOrder[]): number {
    let sum = 0;
    products.forEach(value => {
      sum += (value.product.price * value.quantity);
    });
    return sum;
  }

  loadTotal() {
    this.sub = this.apiService.OrdersChanged.subscribe(() => {
      this.totalPrice = this.calculateTotalPrice(this.orders.productOrders);
    });
  }

  loadCart() {
    this.sub = this.apiService.ProductOrderChanged.subscribe(() => {
      let productOrder = this.apiService.SelectedProductOrder;
      if (productOrder) {
        this.orders.productOrders.push(new ProductOrder(
          productOrder.product, productOrder.quantity
        ));
      }
    });
    this.apiService.ProductOrders = this.orders;
    this.orders = this.apiService.ProductOrders;
    this.totalPrice = this.calculateTotalPrice(this.orders.productOrders);
    console.log(`loadCart: ${this.totalPrice}`);
  }


  addToCart(order: ProductOrder): void {

    console.log(`addToCart ${order.product.name} - ${order.product.price} x ${order.quantity}`);
    this.apiService.SelectedProductOrder = order;
    let productOrder = this.apiService.SelectedProductOrder;
    // this.productSelected = true;

    // Product has not in cart yet
    if (!this.isProductInCart(productOrder.product.id)) {

      this.orders.productOrders.push(new ProductOrder(
        productOrder.product, productOrder.quantity
      ));

    } else {
      console.log('Product in cart' + productOrder);
      // copy array, find item index and update
      let updatedProductOrders = [...this.orders.productOrders];

      //console.log('updatedProductOrders in cart:', updatedProductOrders);

      let productOrderIndex = updatedProductOrders.findIndex((prod) => prod.product.id == productOrder.product.id);

      let prodOrderAtIndex = updatedProductOrders[productOrderIndex];

      let productOrderQuantityIncrement = new ProductOrder(productOrder.product, productOrder.quantity + prodOrderAtIndex.quantity);
      updatedProductOrders[productOrderIndex] = {
        ...productOrderQuantityIncrement
      };

      this.orders.productOrders = updatedProductOrders;
    }

    this.totalPrice = this.getCartTotalPrice();
    this.notification.create(
      'success',
      'Product added to cart',
      `${productOrder.product.name} was successfully added to the cart`
    );
    this.cartDataObs$.next({...this.orders});
    localStorage.setItem('cart', JSON.stringify(this.orders));
  }

  updateCart(id: number, quanity: number): void {
    // copy array, find item index and update
    let updateOrders = [...this.orders.productOrders];
    let orderIndex = updateOrders.findIndex((order) => order.product.id === id);

    let orderAtIndex = updateOrders[orderIndex];

    let orderQuantityIncrement = new ProductOrder(orderAtIndex.product, quanity);
    updateOrders[orderIndex] = {
      ...orderQuantityIncrement
    };

    this.orders.productOrders = updateOrders;
    this.cartDataObs$.next({...this.orders});
    localStorage.setItem('cart', JSON.stringify(this.orders));

    this.notification.create(
      'success',
      'Removed successfully',
      'The selected item was removed from the cart successfully'
    );
  }


  removeProduct(id: number): void {
    let updatedProductOrders = this.orders.productOrders.filter(
      (prodOrder) => prodOrder.product.id !== id
    );

    this.orders.productOrders = updatedProductOrders;
    this.totalPrice = this.getCartTotalPrice();
    this.cartDataObs$.next({ ...this.orders });
    localStorage.setItem('cart', JSON.stringify(this.orders));

    this.notification.create(
      'sucess',
      'Removed successfully',
      'The selected item was removed from the cart successfully'
    );
  }

  clearCart(): void {
    this.orders.productOrders = [];
    this.cartDataObs$.next({ ...this.orders });
    localStorage.setItem("cart", JSON.stringify(this.orders));
  }

  getCartTotalPrice(): number {
    let totalSum = 0;
    this.orders.productOrders.forEach(
      (prod) => (totalSum += prod.product.price * prod.quantity)
    );
    return totalSum;
  }

  getCartCount(): number {
    let totalSum = 0;
    this.orders.productOrders.forEach(
      (prodOrder) => (totalSum += prodOrder.quantity)
    );
    return totalSum;
  }

  isProductInCart(id: number): boolean {
    return this.orders.productOrders.findIndex((prod) => prod.product.id === id) !== -1;
  }

}
