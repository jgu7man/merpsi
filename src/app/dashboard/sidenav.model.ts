export namespace Sidenav {

  export interface module {
    displayName:string,
    items: item[]
    rouote?: string,
    keyword?: string,
    icon?: string,
    condition?: boolean,
    hide?: boolean,
  }

  export interface item {
    route: string,
    displayName: string,
    condition?: boolean
  }
}
