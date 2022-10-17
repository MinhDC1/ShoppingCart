import { Injectable } from '@angular/core';
import { catchError, tap, Observable, of, Subject } from 'rxjs';
import { Product } from '../models/product.model';
import { ProductOrder } from '../models/product-order.model';
import { ProductOrders } from '../models/product-orders.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MessageService } from './message.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = environment.apiUrl;

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  private productsUrl = this.baseUrl + "/api/products";
  private ordersUrl = this.baseUrl + "/api/orders";

  private productOrder!: ProductOrder;
  private orders: ProductOrders = new ProductOrders();

  private productOrderSubject = new Subject();
  private ordersSubject = new Subject();
  private totalSubject = new Subject();

  private total!: number;

  ProductOrderChanged = this.productOrderSubject.asObservable();
  OrdersChanged = this.ordersSubject.asObservable();
  TotalChanged = this.totalSubject.asObservable();

  constructor(private http: HttpClient, private messageService: MessageService) { }

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.productsUrl)
      .pipe(
        tap(_ => this.log('fetched products')),
        catchError(this.handleError<Product[]>('getAllProducts', []))
      );
  }

  saveOrder(order: ProductOrders): Observable<ProductOrders> {
    return this.http.post<ProductOrders>(this.ordersUrl, order, this.httpOptions).pipe(
      //map(productOrder => ProductOrder),
      tap((newOrder: ProductOrders) => this.log(`added order with=${newOrder.productOrders}`)),
      catchError(this.handleError<ProductOrders>('saveOrder'))
    );
  }

  set SelectedProductOrder(value: ProductOrder) {
    this.productOrder = value;
    this.productOrderSubject.next(this.productOrder);
    this.log(`SelectedProductOrder: ${value.product.name} - price:${value.product.price} x quanity: ${value.quantity}`);
  }

  get SelectedProductOrder() {
    return this.productOrder;
  }

  set ProductOrders(value: ProductOrders) {
    this.orders = value;
    this.ordersSubject.next(this.orders);
    this.log(`Order Changed: ${this.orders.productOrders[0].quantity}`)
  }

  get ProductOrders() {
    return this.orders;
  }

  get Total() {
    return this.total;
  }

  set Total(value: number) {
    this.total = value;
    this.totalSubject.next(this.total);
    this.log(`Total Changed: ${this.Total}`)
  }

  private log(message: string) {
    this.messageService.add(`ApiService: ${message}`);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);

      return of(result as T);
    }
  }

}
