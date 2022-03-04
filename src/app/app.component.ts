import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { iCountry } from './models/country.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'merpsi';

  constructor(private _afs: AngularFirestore){

     // this._afs.doc("_admin/countries").set({list: this.countryList})
  }
  /*countryList: iCountry[] = [
    {
      "name": "Colombia",
      "alpha2": "CO",
      "alpha3": "COL",
      "currency": {
          "code": "COP",
          "name": "Peso",
          "symbol": "$"
      },
	  "natural_format": {
		"format": "000.000.000-0" ,
		"name": "Persona Natural",
		"key_name": "Número de Identificación Tributaria",
		"acronym": "NIT",
		"length": 10
	  },
	  "legal_format": {
		"format": "000.000.000-0" ,
		"name": "Persona Jurídica",
		"key_name": "Número de Identificación Tributaria",
		"acronym": "NIT",
		"length": 10
	  },
      "flag": "data:image/jpeg;charset=utf-8;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAUCAIAAAAVyRqTAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpDNEMzNjBDRjE3NzQxMUUyODY3Q0FBOTFCQzlGNjlDRiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpDNEMzNjBEMDE3NzQxMUUyODY3Q0FBOTFCQzlGNjlDRiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkM0QzM2MENEMTc3NDExRTI4NjdDQUE5MUJDOUY2OUNGIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkM0QzM2MENFMTc3NDExRTI4NjdDQUE5MUJDOUY2OUNGIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+jvkEygAAAC9JREFUeNpi/HNRjIE2gImBZmDU6FGjh6PRjAzac0cDZOhH4zlBtdEAGfJGAwQYAIs9A9bKIFNYAAAAAElFTkSuQmCC",
      "locale": "es-CO",
	  "code":"57"
	  
  },
  {
      "name": "Venezuela",
      "alpha2": "VE",
      "alpha3": "VEN",
      "currency": {
          "code": "VEF",
          "name": "Bolivar",
          "symbol": "Bs"
      },
	  "natural_format": {
		"format": "V-00000000-0",
		"name": "Persona Natural",		
		"key_name": "Registro de Información Fiscal",
		"acronym": "RIF",
		"length": 10
	  },
	  "legal_format": {
		"format": "J-00000000-0",
		"name": "Persona Jurídica",
		"key_name": "Registro de Información Fiscal",
		"acronym": "RIF",
		"length": 10
	  },
      "flag": "data:image/jpeg;charset=utf-8;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAUCAIAAAAVyRqTAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo0NjFFMjIwQzE3OEIxMUUyQTcxNDlDNEFCRkNENzc2NiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo3ODRDOUJGQTE3OEIxMUUyQTcxNDlDNEFCRkNENzc2NiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjQ2MUUyMjBBMTc4QjExRTJBNzE0OUM0QUJGQ0Q3NzY2IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjQ2MUUyMjBCMTc4QjExRTJBNzE0OUM0QUJGQ0Q3NzY2Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+suiZXgAAATpJREFUeNpi/H5RnIE2gImBZmDUaPoZzcigsJdGRrMQ8hUjw/ufDO9/+VTov33x/cfPv/LKfBvaLzDwsjAIcjAw/AdCEl0t+IGBhZHh02+Gm+9rpzt8/vHnz+9/v379+/HrrxA/2++//2XEOCsT9jGoCjAIsDG85iPFaOF3DF9+yyrxOZuLs7Iyffz2Z9X0KwyinCBPPP8WmqktxMf648ffo+ff3LnxgeGXOCkBwsLE8OkXz/c/Ho5SmblH3j/5yqDEx/AP7HkV/tVzr3MIsM2f5XDl9GuGDz8ZuEgKEOYX5rZSif6KWVUn/v3/z8DDxvD/P7Imhm9/GX7+ndRuvnbv04M7f5PiambBd//57rMIMIuI//vwi4EZQxnrXwZe5kdsQm/+fWZgeEvvxMd4XkR7NKOPGo0bAAQYAF2fdeRLtEqSAAAAAElFTkSuQmCC",
      "locale": "es-VE",
	  "code":"58"
  },
  {
      "name": "Mexico",
      "alpha2": "MX",
      "alpha3": "MEX",
      "currency": {
          "code": "MXN",
          "name": "Peso",
          "symbol": "$"
      },
	  "natural_format": {
		"format": "SSSS000000SSS" ,
		"name": "Persona Física",
		"key_name": "Registro Fiscal de Contribuyente",
		"acronym": "RFC",
		"length": 13,
	  },
	  "legal_format": {
		"format": "000.000.000-0" ,
		"name": "Persona Moral",
		"key_name": "Registro Fiscal de Contribuyente",
		"acronym": "RFC",
		"length": 10
	  },
      "flag": "data:image/jpeg;charset=utf-8;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAUCAYAAACaq43EAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoxOUI5NTczNTE3ODMxMUUyQTcxNDlDNEFCRkNENzc2NiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDoxOUI5NTczNjE3ODMxMUUyQTcxNDlDNEFCRkNENzc2NiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkUxRjE5ODIwMTc4MjExRTJBNzE0OUM0QUJGQ0Q3NzY2IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjE5Qjk1NzM0MTc4MzExRTJBNzE0OUM0QUJGQ0Q3NzY2Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+0LwZHQAAAaBJREFUeNpiZMhw/8SAD7x4zODm6M+wM6+NgVjwKKeS4enUTgYOQVWcaliAmJdhAAATwwCBUYtJAv///aOfxf+B+Pev7wzPr51g2NwWydDkb8Rw5dQR2lvMCMTvX19guLWrleHW+bMMBw6cZygPtGV4fvsyLSz+D2f9/PWK4T87N4OgmgvD1TuvGBz8XRnEeRgYVk1sRKj+/5+giSxE+ZKJGUy/fHmLgecfJwPTh6sMHB9PM/z5+oXh4zdWBo+CLoZf/9kYnr+6zSAupsrAwsJKLR8zgskvnx8xHHv0jGHJ+a8MD8UcGFyqehg+Pj/J8OXjdwZbHy+GJ88voain2OL///6CaW4ucQZx9tsM/zS9GJZ8MWa4zf6HQaK0kYHZ0ovh8/MzDCJCsmAD//z9Rd3EJSGlyyDCI8WgzXKZIUDoFoPj48MM7L/5GYT5XzJwCIkxKMqaQf3LSJ04RgaSKk4M/C/OMdz8+53ht0kOgz/7WwZhEXEGaRkTksxhISc7cUsYMRgBMcM/YOplYhyAIpNMS0crCboCUOL6PBAWAwQYAIwVfZVkoDrqAAAAAElFTkSuQmCC",
      "locale": "es-MX",
	  "code":"52"
  },
  {
      "name": "Chile",
      "alpha2": "CL",
      "alpha3": "CHL",
      "currency": {
          "code": "CLP",
          "name": "Peso",
          "symbol": "$"
      },
	  "natural_format": {
		"format": "000.000.000-0" ,
		"name": "Persona Individual",
		"key_name": "Rol Ùnico Tributario",
		"acronym": "RUT",
		"length": 10
	  },
	  "legal_format": {
		"format": "000.000.000-0" ,
		"name": "Persona Jurídica",
		"key_name": "Rol Ùnico Tributario",
		"acronym": "RUT",
		"length": 10
	  },
      "flag": "data:image/jpeg;charset=utf-8;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAUCAYAAACaq43EAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo1NDUwRENDODE3NzQxMUUyODY3Q0FBOTFCQzlGNjlDRiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo1NDUwRENDOTE3NzQxMUUyODY3Q0FBOTFCQzlGNjlDRiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjIxNEQxRUZEMTc3NDExRTI4NjdDQUE5MUJDOUY2OUNGIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjIxNEQxRUZFMTc3NDExRTI4NjdDQUE5MUJDOUY2OUNGIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+KpHXrgAAAXlJREFUeNrsVrtKA0EUPbOv7CZZNSIqQkCxsrHLR9hY2QuC+A12Pr7DT7ATrAQLbUJKC1tZI2rQVZNsspvMjHd3QxLwgcUONjkwu3fuFGfOfQyXoXJaB7BEq4nv8B4hv+DAO9vA7JSFDODSejAGRurQGdDup7sCHXEJRXCNoRlzdDimHR1Ej7eAA5aGZKMAWvIVEhYR4r6Fnc1l7G2tAvVW6hNqVKeKI4GIcewfVXCwuwbT0OCULByf3AJdrlCxTcqeAlxUn2GZGhiF97LWAPfagGMoVByDCPOU0+3DGoSg9MaFpjDHI+I5G9UbH1fnHhFL5MpFYN4B/FARMSukFikLQpK6aCOOdadHRWWSk5m07GFWMiO2pT9qJ33sJLbpHl1EyAkHMgzIUYQIs4kAu14vf4w9Il8g6UIaiZ1xreQvs+muprEiH38ve4o2p456ueuhL9J9JqF+Ze6fmk4rUZFn3sf/gAnxhFgZjMHI4/44+iiYPmKuTwEGAHthZNcUQvnKAAAAAElFTkSuQmCC",
      "locale": "es-CL",
	  "code":"56"
  },
  {
      "name": "Peru",
      "alpha2": "PE",
      "alpha3": "PER",
      "currency": {
          "code": "PEN",
          "name": "Sol",
          "symbol": "S/."
      },
	  "natural_format": {
		"format": "000.000.000-0" ,
    "name": "Persona Natural",
		"key_name": "Registro Único de Contribuyente",
		"acronym": "RUC",
		"length": 10
	  },
	  "legal_format": {
		"format": "000.000.000-0" ,
    "name": "Persona Jurídica",
		"key_name": "Registro Único de Contribuyente",
		"acronym": "RUC",
		"length": 10
	  },
      "flag": "data:image/jpeg;charset=utf-8;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAUCAYAAACaq43EAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo3QjRGQkQxQTE3ODUxMUUyQTcxNDlDNEFCRkNENzc2NiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo3QjRGQkQxQjE3ODUxMUUyQTcxNDlDNEFCRkNENzc2NiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjRDMzdGQUUxMTc4NTExRTJBNzE0OUM0QUJGQ0Q3NzY2IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjRDMzdGQUUyMTc4NTExRTJBNzE0OUM0QUJGQ0Q3NzY2Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+b8OOOwAAAGlJREFUeNpiPMPA8JSBgUEKiD8zYAF/gJiNi4tB7/FjBmYhIQZ84N+PHwyXZWUZvr95w8CKWxkvED9jgTIYkGh6AF4mhgECoxaPWjxq8ajFoxaPWjxq8cBbzAJt8vDiavrQovUBsgsgwABVWxD3afjyOwAAAABJRU5ErkJggg==",
      "locale": "es-PE",
	  "code":"51"
      
  }
  ];*/
}
