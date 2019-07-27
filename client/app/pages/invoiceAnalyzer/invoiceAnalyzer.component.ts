import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Tesseract} from 'tesseract.ts';

import {UserService} from '../../services/user.service';
import {ToastComponent} from '../../shared/toast/toast.component';
import {InvoiceService} from '../../services/invoice.service';
import {SupplierService} from '../../services/supplier.service';
import {AuthService} from '../../services/auth.service';


@Component({
    selector: 'app-invoice-analyzer',
    templateUrl: './invoiceAnalyzer.component.html',
    styleUrls: ['./invoiceAnalyzer.component.scss']
})

export class InvoiceAnalyzerComponent implements OnInit {
    title = 'Invoice Analyzer';
    invoiceForm: FormGroup;
    imagePath;
    suppliers;
    isLoading = true;
    img: any;
    message: string;

    lang: 'heb';

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

    invoiceDate = new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20)
    ]);

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        public toast: ToastComponent,
        private userService: UserService,
        private invoiceService: InvoiceService,
        private supplierService: SupplierService,
        private authService: AuthService
    ) {
    }

    ngOnInit() {
        this.invoiceForm = this.formBuilder.group({
            invoiceId: this.invoiceId,
            supplierName: this.supplierName,
            totalPayment: this.totalPayment,
            invoiceDate: this.invoiceDate,
            username: this.authService.currentUser.username
        });

        this.suppliers = this.supplierService.getSuppliers();
        console.log(this.suppliers);

        this.isLoading = false;
    }

    submit() {
        this.invoiceService.addInvoice(this.invoiceForm.value).subscribe(
            res => {
                this.toast.open('you successfully created new invoice!', 'success');
            },
            error => this.toast.open('There was a problem creating new invoice', 'danger')
        );
    }

    upload(files) {
        if (files.length === 0) {
            return;
        }

        const mimeType = files[0].type;
        if (mimeType.match(/image\/*/) == null) {
            this.message = 'Only images are supported.';
            console.log(this.message);
            return;
        }

        const reader = new FileReader();
        this.imagePath = files;
        reader.readAsDataURL(files[0]);
        reader.onload = (_event) => {
            this.img = reader.result;
        };

        const encodedImage = this.handleFileSelect(files[0], this.authService.currentUser.username);
    }

    handleFileSelect(file, username) {
        const reader = new FileReader();

        reader.readAsDataURL(file);
        const config = {
            lang: 'heb'
        };

        Tesseract
            .recognize(file, config)
            // .progress(console.log)
            .then((res: any) => {

                if (config.lang === ('heb')) {
                    this.parseHeb(res);
                } else if (config.lang === ('eng')) {
                    this.parseEng(res);
                } else {
                    return;
                }
            })
            .catch(console.error);

        reader.onload = () => {
            console.log(reader.result);
            const parameter = {image: reader.result, imageName: file.name, username: username, lang: 'heb'};
            console.log(parameter);
            //this.invoiceService.uploadImage(parameter);
        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };

        return reader.result;
    }


    parseHeb(tes) {
        console.log(tes.text);

        /*for (let i = 0 ; i < words.size; i++ ) {
            if (tes.text.contains('לתשלום:')) {
                break;
            }
        }*/

        // Invoice id regex (i.g. 11111)
        /*for (let i = 0 ; i < words.size; i++ ) {
            if (words[i].match(/^([0-9]){5}$/i)) {
                break;
            }
        }*/



        // Date regex (i.g. 31.12.2019)
        for (let i = 0 ; i < tes.words.length; i++ ) {
            const word = tes.words[i].text;

            const isMatch = word.match(/^([0-2][0-9]|(3)[0-1])(\/|.|-)(((0)[0-9])|((1)[0-2]))(\/|.|-)(\d{4}$|\d{2}$)/i);
            if (isMatch) {
                /*console.log(tes.words[i-3].text)
                console.log(tes.words[i-2].text)
                console.log(tes.words[i-1].text)*/
                this.invoiceForm.controls['invoiceDate'].setValue(tes.words[i].text);
                break;
            }
        }

    }

    parseEng(words) {

    }
}


