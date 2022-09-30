import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { iCountry } from 'src/app/models/country.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(
    private _afs: AngularFirestore  ) { 
  }

  async getCountry(): Promise<iCountry[]> {
    try {
      let countriesList = await this._afs.doc<{list:iCountry[]}>("_admin/countries").ref.get()
      let result = countriesList.data()
      return result?.list || []

    } catch (error) {
      console.error(error)
      return []
    }
  }
}
