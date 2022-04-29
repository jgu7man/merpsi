export class SedeModel {
    constructor(
    public name: string,
    public referencia: string,
    public tipo: string,
    public direccion?: string,
    public ciudad?: string,
    public depto?: string,
    // public telefono?: string,
    public linkmap?: string,
    public id?: string,
  ) {}
}

export interface iSede extends SedeModel { }
export interface iSedeRef {
  id: string,
  referencia: string,
}
