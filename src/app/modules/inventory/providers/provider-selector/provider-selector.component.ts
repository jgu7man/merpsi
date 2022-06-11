import { Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationService } from 'primeng/api';
import { filter, first } from 'rxjs/operators';
import { iBusiness } from 'src/app/models/empresa.model';
import { listenChanges } from 'src/app/models/operators-chains.model';
import { ProviderNewDialog } from 'src/app/modules/finances/purchase-invoices/provider-new.dialog/provider-new.dialog';
import { iProvider, ProviderModel } from '../provider.model';
import { ProviderService } from '../provider.service';

@Component({
  selector: 'app-provider-selector',
  templateUrl: './provider-selector.component.html',
  styleUrls: ['./provider-selector.component.scss']
})
export class ProviderSelectorComponent implements OnInit, OnDestroy{
  public crfCtrl: FormControl = new FormControl()

  @ViewChild('crfInput') crfInput!: ElementRef
  @Output() result: EventEmitter<any> = new EventEmitter()

  constructor(
    public providerService: ProviderService,
    private _confirm: ConfirmationService,
    private _dialog: MatDialog
  ) { }
  
  ngOnInit(): void {
    this.crfCtrl.valueChanges.pipe(
      listenChanges(500),
      filter(value => value && value.length >= 8)
      ).subscribe(async (crf: any) => {
        let provider = await this.providerService.findProviderByCRF(crf)
        
        if (!provider) {
        let business = await this.providerService.findBusinessByCRF(crf)
        if (business == null) {
          this.crfCtrl.setErrors({ unknown: true })
        } else {
          this.alertProviderFound(business)
        }
      } else {
        this.alertProviderFound(provider)
      }
    })
  }
  ngOnDestroy(): void {
    this.crfCtrl.patchValue('')
  }


  private async alertProviderFound(provider: iProvider | iBusiness) {
    this._confirm.confirm({
      target: this.crfInput.nativeElement,
      message: `Proveedor ${provider.businessName.toUpperCase()} encontrado, ¿Deseas agregarlo a la Factura?`,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.providerService.providerSelect$.next(provider)
        this.result.emit(
          provider
        )
      },
      reject: () => { }
    })
  }

  openNewProvider() {
    this._dialog.open(ProviderNewDialog, {
      maxWidth: '100%',
      data: {
        crf: this.crfCtrl.value
      }
    }).afterClosed().pipe(first())
      .subscribe((provider: ProviderModel) => {
        this.providerService.providerSelect$.next(provider)
        this.crfCtrl.setErrors({ unknown: null })
        this.result.emit({
          businessName: provider.businessName,
          CRF: provider.CRF,
        })
      })
  }

}
