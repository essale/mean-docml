import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

import {Invoice} from '../shared/models/invoice.model';

@Injectable()
export class InvoiceService {

  constructor(private http: HttpClient) {
  }

  addInvoice(invoice: Invoice): Observable<Invoice> {
    return this.http.post<Invoice>('/api/invoice', invoice);
  }

  getInvoice(id: String): Observable<Invoice> {
    return this.http.get<Invoice>(`/api/invoice/${id}`);
  }

  editInvoice(invoice: Invoice): Observable<string> {
    return this.http.put(`/api/invoice/${invoice._id}`, invoice, {responseType: 'text'});
  }

  deleteInvoice(invoice: Invoice): Observable<string> {
    return this.http.delete(`/api/invoice/${invoice._id}`, {responseType: 'text'});
  }

  getInvoices(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>('/api/invoice');
  }

}
