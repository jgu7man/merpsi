# Taxes Amount CRUD
Este documento describe como usar el componente CRUD de *impuestos aplicados* dentro de las facturas o donde se requiera.

**❗❗❗ Importante: No se he probado❗❗❗**

## Instalación
**⚠ NOTA**: Antes de instalar, se recomienda crear una lista de impuestos de la empresa. Para realizar esto en **Dashboard** -> **Finanzas** -> **Impuestos** encontrás un CRUD panel para crear los impuestos de la empresa. 

1. En el HTML de tu componente donde instalarás. Ingreesa el selector con el parámetro `amount_base`, el cuál es el monto base (Subtotal) sobre el cuál se harán los cálculos.

    ```html
    <app-tax-amount-crud 
    [amount_base]="number"
    ></app-tax-amount-crud>
    ```

2. Esto renderizará un `mat-select` a través del cuál podrás elegir entre las opciones de impuestos agregados por la empresa.
3. Al seleccionar de la lista un impuesto, se agregará en la parte superior del select la lista de impuestos agregados con la operación que calcula el impuesto.
4. Cada impuesto agregado tendrá su propio cálculo agregado basado en el impuesto de la empresa.
5. La lista de impuestos agregados la podrás encontrar en el servicio `taxes.service.ts`.

    *tu-componente.component.ts*
    ```ts
      @Component({...})
      export class TuComponenteComponent implements OnInit {

        constructor(
          private _taxes: TaxesService
        ) {
          /* AppliedTaxModel[] */ 
          this._taxes.appliedTaxes
        }
      }
    ```

6. El servicio de **taxes** cuenta con *getter* para obtener el total de la suma de los items agregados.

    ```ts
    /* number */
    this._taxes.appliedTaxesTotal
    ```
