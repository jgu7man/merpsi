import { NgModule } from '@angular/core';

import { MxAuthModule } from '@marxa/auth'
import { MxIndexModule } from "@marxa/index";
import { MxScannerModule } from 'libs/@marxa/scanner/mx-scanner.module';
// import { MxNavbarModule } from "@marxa/navbar";
// import { MxSliderModule } from "@marxa/slider";
// import { MxSocialShareModule } from "@marxa/social-share";
import { MxStorageModule } from '@marxa/storage';
import { MxCrudPanelModule } from 'libs/@marxa/crud-panel/src/public-api';
import { MxDevkitModule } from 'libs/@marxa/devkit/marxa-devkit.module';


@NgModule({
  exports: [
    MxAuthModule,
    MxCrudPanelModule,
    MxIndexModule,
    MxStorageModule,
    MxScannerModule,
    MxDevkitModule
  ]
})
export class MarxaModule {}
