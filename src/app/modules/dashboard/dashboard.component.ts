import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { NavigationEnd, Router } from '@angular/router';
import { MxResponsive } from '@marxa/devkit';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  /** Selector del sidebar */
  @ViewChild('menuSidebar') menuSidebar!: MatDrawer
  routeSubscription: Subscription

  constructor(
    public responsive: MxResponsive,
    private _router: Router,
  ) {

    /* Suscripción a los cambios en la ruta del URL */
    this.routeSubscription = this._router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe( event => {
      
      /* Si la pantalla es "large" el sidebar se cerrará */
      if (this.menuSidebar && this.menuSidebar.opened && !this.responsive.large)
        this.menuSidebar.close()
    })
   }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe()
  }

}
