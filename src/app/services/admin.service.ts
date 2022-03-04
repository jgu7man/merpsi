import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { iCountry } from '../models/country.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(
    private _afs: AngularFirestore
  ) { }

  async getCountry(): Promise<iCountry[]> {
    try {
      let countriesList = await this._afs.doc<iCountry[]>("_admin/countries").ref.get()

      return countriesList.data() || []

    } catch (error) {

      console.error(error)

      return []
    }
  }
}
