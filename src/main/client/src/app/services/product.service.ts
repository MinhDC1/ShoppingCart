import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product.model';
import { catchError, Observable, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiService } from './api.service';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private url = environment.apiUrl;

  constructor(private http: HttpClient, private Api: ApiService, private messageService: MessageService) { }

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.url + "/api/products")
      .pipe(
        tap(_ => this.log('fetched products')),
        catchError(this.handleError<Product[]>('getAllProducts', []))
      );
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
