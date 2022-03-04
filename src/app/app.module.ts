import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FirebaseModule } from 'shared/firebase.module';
import { MaterialModule } from 'shared/material.module';
import { MarxaModule } from 'shared/marxa.module';
import { PanelLoginComponent } from './components/panel-login/panel-login.component';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { RegistComponent } from './components/regist/regist.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GenericRegistFormComponent } from './components/generic-regist-form/generic-regist-form.component';
import { NgxMaskModule, IConfig  } from 'ngx-mask';
const maskConfig: Partial<IConfig> = {
  validation: false,
};

@NgModule({
  declarations: [
    AppComponent,
    PanelLoginComponent,
    RegistComponent,
    GenericRegistFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp( environment.firebaseConfig ),
    ReactiveFormsModule,
    FormsModule,
    NgxMaskModule.forRoot(maskConfig),
    FirebaseModule,
    MaterialModule,
    MarxaModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
