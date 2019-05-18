import BaseCtrl from './base';
import Invoice from '../models/invoice';

export default class InvoiceCtrl extends BaseCtrl {
  model = Invoice;
}
