# Current Product
Este documento informa el modo de uso del serivcio `CurrentProduct`.

## Consideraciones
Este servicio y sus componentes funcionan con el manejo del estado (**STATE**) del producto a través de un `BehaivourSubject`.

## Formulario en modal
Para usar el formulario simple de creación de producto, existe un modal precreado: `ProductFormDialog`. Este ya cuenta con un botón de guardado. Al ejecutarse el guardado del proucto, el modal se cerrará. Si el guardado es exitoso, `afterClose` retornará el **La referencia de firebase del producto**. De lo contrario, retornorá vacío.

*Descripción técnica del guardado en el modal:*
```ts
onSubmit() {
  this.current.save()
    /* El guardado exitoso retorna Referencia de firestore del producto */
    .then( (productDoc: DocumentSnapshot<ProductModel>) => {
        this.dialog.close(productDoc)
      } )
    /* El error en el guardado retorna vacío */
    .catch( () => this.dialog.close() )
}
```

## Guardado
Para guardar el **STATE** del producto, se debe agregar un botón que llame el método `save()`. El cuál retorna la referencia en firestore del producto guardado

```ts
async save(): DocumentSnapshot<ProductModel>
```

