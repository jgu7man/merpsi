import { Observable } from "rxjs";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";

export function listenChanges(time = 0) {
  return function <T>( source: Observable<T> ) {
    return source.pipe( 
      debounceTime( time ),
      distinctUntilChanged( ( x, y ) => JSON.stringify(x) == JSON.stringify(y))
    );
  }
}