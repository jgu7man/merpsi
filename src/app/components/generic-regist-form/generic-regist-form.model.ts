export interface iFieldLabels {
  'email': iFieldLabel,
  'name': iFieldLabel,
  'password': iFieldLabel,
  'confirmPwd': iFieldLabel,
  'acept': iFieldLabel,
}

export interface iFieldLabel {
  label: string,
  errors: iErrorMessage[]
}

export interface iErrorMessage {
  errorType: string,
  message: string
}

export interface iRegistFormChanges {values: any, valid: boolean}

export const defaultLabelsValue: iFieldLabels = {
  email: {
    label: 'Email',
    errors: [
      {
        errorType: 'required',
        message: 'El correo es necesario'
      },
      {
        errorType: 'email',
        message: 'Ingresa un formato de correo válido'
      }
    ]
  },
  name: {
    label: 'Nombre',
    errors: [
      {
        errorType: 'required',
        message: 'Al menos escribe un nombre'
      }
    ]
  },
  password: {
    label: 'Contraseña',
    errors: [
      {
        errorType: 'required',
        message: 'Es necesario que agregues una clave'
      },
      {
        errorType: 'minlength',
        message: 'La clave debe contener mínimo 8 caracteres'
      },
      {
        errorType: 'pattern',
        message: 'La clave debe contener numeros y letras'
      }
    ]
  },
  confirmPwd: {
    label: 'Confirmar contraseña',
    errors: [
      {
        errorType: 'required',
        message: 'Es necesario que agregues una clave'
      },
      {
        errorType: 'notSame',
        message: 'La contraseña ingresada debe ser igual'
      }
    ]
  },
  acept: {
    label: 'Acepto los términos y condiciones',
    errors: [
      {
        errorType: 'required',
        message: 'Debes aceptar los términos y condiciones para poder registrtarte'
      },
    ]
  }
}