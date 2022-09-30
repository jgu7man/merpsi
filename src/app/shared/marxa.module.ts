import { NgModule } from '@angular/core';

import { MxAuthModule } from '@marxa/auth'
import { MxScannerModule } from 'libs/@marxa/scanner/mx-scanner.module';
// import { MxNavbarModule } from "@marxa/navbar";
// import { MxSliderModule } from "@marxa/slider";
// import { MxSocialShareModule } from "@marxa/social-share";
import { MxStorageModule } from '@marxa/storage';
import { MxCrudPanelModule } from '@marxa/crud-panel';
import { MxIndexModule } from '@marxa/index';
import { MxCacheModule, MxColorsModule, MxDateTimeModule} from '@marxa/devkit'


@NgModule({
  exports: [
    MxAuthModule,
    MxCrudPanelModule,
    MxIndexModule,
    MxStorageModule,
    MxScannerModule,
    MxDateTimeModule,
    MxCacheModule,
    MxColorsModule
  ]
})
export class MarxaModule {}
