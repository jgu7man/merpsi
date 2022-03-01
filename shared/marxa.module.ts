import { NgModule } from '@angular/core';

import {
  MxColorsModule,
  MxResponsiveModule,
  MxDateTimeModule,
  MxTextModule,
  MxCacheModule,
} from "@marxa/devkit";
import { MxAuthModule } from '@marxa/auth'
import { MxIndexModule } from "@marxa/index";
// import { MxNavbarModule } from "@marxa/navbar";
// import { MxSliderModule } from "@marxa/slider";
import { MxStorageModule } from '@marxa/storage';
// import { MxSocialShareModule } from "@marxa/social-share";
// import { MxCrudPanelModule } from '@marxa/crud-panel';

@NgModule({
  exports: [
    MxAuthModule,
    MxCacheModule,
    // MxCrudPanelModule,
    MxColorsModule,
    MxResponsiveModule,
    MxDateTimeModule,
    MxTextModule,
    MxIndexModule,
    // MxNavbarModule,
    // MxSliderModule,
    MxStorageModule,
    // MxSocialShareModule,
  ]
})
export class MarxaModule {}
