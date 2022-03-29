import { NgModule } from '@angular/core';

import { MxAuthModule } from '@marxa/auth'
import { MxIndexModule } from "@marxa/index";
import { MxCacheModule } from 'libs/@marxa/devkit/cache/cache.module';
import { MxColorsModule } from 'libs/@marxa/devkit/color/mx-colors.module';
import { MxResponsiveModule } from 'libs/@marxa/devkit/responsive/mx-responsive.module';
import { MxDateTimeModule } from 'libs/@marxa/devkit/date-time/mx-date.module';
import { MxTextModule } from 'libs/@marxa/devkit/text/mx-text.module';
import { MxScannerModule } from 'libs/@marxa/scanner/mx-scanner.module';
// import { MxNavbarModule } from "@marxa/navbar";
// import { MxSliderModule } from "@marxa/slider";
// import { MxSocialShareModule } from "@marxa/social-share";
import { MxStorageModule } from '@marxa/storage';
import { MxTestModule } from 'libs/@marxa/devkit/test/mx-test.module';
import { MxCrudPanelModule } from 'libs/@marxa/crud-panel/src/public-api';

@NgModule({
  exports: [
    MxAuthModule,
    MxCacheModule,
    MxCrudPanelModule,
    MxColorsModule,
    MxResponsiveModule,
    MxDateTimeModule,
    MxTextModule,
    MxIndexModule,
    // MxNavbarModule,
    // MxSliderModule,
    MxStorageModule,
    // MxSocialShareModule,
    MxScannerModule,
    MxTestModule
  ]
})
export class MarxaModule {}
