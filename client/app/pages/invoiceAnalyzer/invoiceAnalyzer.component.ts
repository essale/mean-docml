import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

import {UserService} from '../../services/user.service';
import {ToastComponent} from '../../shared/toast/toast.component';
import {InvoiceService} from '../../services/invoice.service';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-invoice-analyzer',
  templateUrl: './invoiceAnalyzer.component.html',
  styleUrls: ['./invoiceAnalyzer.component.scss']
})

export class InvoiceAnalyzerComponent implements OnInit {
  title = 'Invoice Analyzer';
  invoiceForm: FormGroup;

  invoiceId = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(100)
  ]);

  supplierName = new FormControl('', [
    Validators.required,
    Validators.minLength(6)
  ]);

  totalPayment = new FormControl('', [
    Validators.required,
    Validators.minLength(6)
  ]);

  constructor(
      private formBuilder: FormBuilder,
      private router: Router,
      public toast: ToastComponent,
      private userService: UserService,
      private invoiceService: InvoiceService,
      private authService: AuthService
  ) {
  }

  ngOnInit() {
    this.invoiceForm = this.formBuilder.group({
      invoiceId: this.invoiceId,
      supplierName: this.supplierName,
      totalPayment: this.totalPayment,
      username: this.authService.currentUser.username
    });
  }

  submit() {
    this.invoiceService.addInvoice(this.invoiceForm.value).subscribe(
        res => {
          this.toast.open('you successfully created new invoice!', 'success');
        },
        error => this.toast.open('There was a problem creating new invoice', 'danger')
    );
  }
}
