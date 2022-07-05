import { iManager } from './../../modules/admin/managers/manager.model';
import { Location } from '@angular/common';
import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { mergeMap } from 'rxjs/operators';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Output } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { MxResponsive } from 'libs/@marxa/devkit/responsive/mx-responsive.service';
import { MxCache } from 'libs/@marxa/devkit/cache/mx-cache.service';
import { PersonalService } from 'src/app/modules/admin/managers/personal.service';
import { Sidenav } from '../sidenav.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, OnDestroy {


  public eid?: string;
  /** Suscripción de los cambios del usuario */
  private userSubscription: Subscription
  /** Emite un evento para que el componente del dashboard cierre el sidebar */
  @Output() closePanel: EventEmitter<any> = new EventEmitter()

  authUser: iManager | null = null
  modules$ = new BehaviorSubject<Sidenav.module[]>([])

  constructor (
    public auth: AuthService,
    public location: Location,
    public responsive: MxResponsive,
    private _router: Router,
    private _cache: MxCache,
    private _route: ActivatedRoute
  ) {
    this.responsive.smallWidth = 415
    this.auth.userState$.subscribe( user => {
      console.log( user )
      this.authUser = user
      console.log( this.navModules )
      this.modules$.next(this.navModules)
    })

    /* Suscripción a los cambios de autenticación */
    // this.userSubscription = this.auth.userState$.subscribe((state)=>{
    //   console.log(state)
    //   let eid = this.route.snapshot.params
    //   if (!eid) {
    //     if (state?.businesses.length==1){
    //       this._router.navigate(['/d/empresa',state.businesses[0]])
    //     }
    //   }

    // })
    this.userSubscription = this.auth.authUser$.pipe(
      mergeMap(() => this.auth.userState$)
    ).subscribe(user => {
      let eid = this._route.snapshot.params.eid
      if (!eid) {
        if (user?.businesses.length==1){
          this._router.navigate(['/',user.businesses[0]])
        }
      }else{
        this._cache.updateData('eid', eid)
        // let empresa = this._cache.getDataKey('eid')
      }
    })
  }

  ngOnInit(): void {
  }

  get href() {
    return window.location.href
  }

  get isLocalhost() {
    return this.href.includes('localhost')
  }

  onActive(path: string) {
    return this.location.path().includes(path)
  }

  signOut() {
    this.auth.signOut()
    this._router.navigate(['/login'])
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe()
  }

  get adminPermissions() {
    return !!this.authUser && (this.authUser.rol == 'administrador' || this.authUser.rol == 'propietario')
  }


  navModules: Sidenav.module[] = [
    /* CHECKOUT */
    {
      keyword: 'checkout',
      icon: 'point_of_sale',
      displayName: 'Punto de venta',
      items: [
        {
          route: 'checkout/panel',
          displayName: 'Panel'
        },
      ]
    },
    /* INVENTORY */
    {
      keyword: 'inventory',
      icon: 'inventory',
      displayName: 'Inventario',
      condition: this.adminPermissions,
      items: [
        {
          route: 'inventory/products',
          displayName: 'Productos'
        },
        {
          route: 'inventory/providers',
          displayName: 'Proveedores'
        },
        {
          route: 'inventory/countings',
          displayName: 'Arqueos',
          condition: this.authUser?.rol == 'administrador'
        },
      ]
    },
    /* FINANCES */
    {
      keyword: 'finances',
      icon: 'currency_exchange',
      displayName: 'Finanzas',
      condition: this.adminPermissions,
      items: [
        {
          route: 'finances/sales',
          displayName: 'Facturas de venta'
        },
        {
          route: 'finances/purchases',
          displayName: 'Facturas de compra'
        },
        {
          route: 'finances/accouting',
          displayName: 'Contabilidad'
        },
        {
          route: 'finances/reports',
          displayName: 'Reportes'
        },
        // {
        //   route: 'finances/predict',
        //   displayName: 'Analizador de ventas'
        // },
        {
          route: 'finances/taxes',
          displayName: 'Impuestos'
        },
        {
          route: 'finances/credit-notes',
          displayName: 'Notas de Crédito'
        },
        {
          route: 'finances/debit-notes',
          displayName: 'Notas de Débito'
        },
        {
          route: 'finances/stubs',
          displayName: 'Talonarios'
        },
      ]
    },
    /* CLIENTS */
    {
      keyword: 'clients',
      icon: 'group',
      displayName: 'Clientes',
      items: [
        {
          route: 'clientes/list',
          displayName: 'Lista'
        },
      ]
    },
    /* ADMIN */
    {
      keyword: 'admin',
      icon: 'store',
      displayName: 'Empresa',
      condition: this.adminPermissions,
      items: [
        {
          route: 'admin/personal',
          displayName: 'Personal'
        },
        {
          route: 'admin/sedes',
          displayName: 'Sedes'
        },
        {
          route: 'admin/notificaciones',
          displayName: 'Configuración',
        },
      ]
    },
    /* PAGE */
    // {
    //   keyword: 'website',
    //   icon: 'inventory',
    //   displayName: 'Sitio web',
    //   condition: this.authUser?.rol == 'administrador' || this.authUser?.rol == 'propietario',
    //   items: [
    //     {
    //       route: 'website/landing',
    //       displayName: 'Hero'
    //     },
    //     {
    //       route: 'website/blog',
    //       displayName: 'Blog'
    //     },
    //     {
    //       route: 'website/catalog',
    //       displayName: 'Catalogo',

    //     },
    //   ]
    // },
  ]

}


