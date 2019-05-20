import {Component, OnInit, ViewChild} from '@angular/core';
import {ToastComponent} from '../../shared/toast/toast.component';
// import { AuthService } from '../../services/auth.service';
import {Supplier} from '../../shared/models/supplier.model';
import {ConfirmationDialogComponent} from '../../shared/confirm/confirmation-dialog';
import {MatDialog, MatPaginator, MatTableDataSource, MatSort} from '@angular/material';
import {FormControl} from '@angular/forms';
import {SupplierService} from '../../services/supplier.service';

@Component({
    selector: 'app-suppliers',
    templateUrl: './suppliers.component.html',
    styleUrls: ['./suppliers.component.scss']
})

export class SuppliersComponent implements OnInit {

    title = 'Suppliers';
    suppliers: Supplier[] = [];
    isLoading = true;
    hllCounter: number = 0;
    displayedColumns = ['supplierName', 'email', 'phoneNumber'];
    dataSource: any;

    filterValues = {
        supplierName: '',
        email: '',
        phoneNumber: ''
    };
    supplierNameFilter = new FormControl('');
    emailFilter = new FormControl('');
    phoneFilter = new FormControl('');

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(
        // public auth: AuthService,
        public toast: ToastComponent,
        private supplierService: SupplierService,
        public dialog: MatDialog
    ) {
    }

    ngOnInit() {
        this.getSuppliers();

        this.supplierNameFilter.valueChanges
            .subscribe(
                value => {
                    this.filterValues.supplierName = value;
                    this.dataSource.filter = JSON.stringify(this.filterValues);
                }
            );
        this.emailFilter.valueChanges
            .subscribe(
                value => {
                    this.filterValues.email = value;
                    this.dataSource.filter = JSON.stringify(this.filterValues);
                }
            );
        this.phoneFilter.valueChanges
            .subscribe(
                value => {
                    this.filterValues.phoneNumber = value;
                    this.dataSource.filter = JSON.stringify(this.filterValues);
                }
            );
    }

    createFilter(): (data: any, filter: string) => boolean {
        let filterFunction = function (data, filter): boolean {
            let searchTerms = JSON.parse(filter);
            let flag = true;
            Object.keys(searchTerms).forEach(function (key) {
                if (searchTerms[key] !== '') {
                    if (!data[key] || data[key].toString().indexOf(searchTerms[key]) === -1) {
                        flag = false;
                    }
                }
            });
            return flag;
        };
        return filterFunction;
    }

    getSuppliers() {
        this.supplierService.getSuppliers().subscribe(
            data => {
                this.suppliers = data;
                this.dataSource = new MatTableDataSource<Supplier>(this.suppliers);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
                this.dataSource.filterPredicate = this.createFilter();
                this.getSupplierssDomainsCount();

            },
            error => console.log(error),
            () => this.isLoading = false
        );
    }

    getSupplierssDomainsCount() {
        this.supplierService.getSupplierssDomainsCount().subscribe(
            data => {
                console.log('getUsersDomainsCount --> ' + data);
                this.hllCounter = data;
            },
            error => console.log(error)
        );
    }

    deleteSupplier(supplier: Supplier) {
        var dialogRef = this.dialog.open(ConfirmationDialogComponent, {disableClose: false});
        dialogRef.componentInstance.title = 'Delete Supplier';
        dialogRef.componentInstance.message = 'Are you sure you want to delete ' + supplier.supplierName + '?';
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.supplierService.deleteSupplier(supplier).subscribe(
                    data => this.toast.open('supplier deleted successfully.', 'success'),
                    error => this.toast.open('error deleting the supplier', 'danger'),
                    () => this.getSuppliers()
                );
            }
        });
    }
}

