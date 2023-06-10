import { Injectable } from '@angular/core';
import { RouteReuseStrategy, ActivatedRouteSnapshot, DetachedRouteHandle } from '@angular/router';

@Injectable()
export class CustomRouteReuseStrategy implements RouteReuseStrategy {

    shouldReuseRoute(before: ActivatedRouteSnapshot, current: ActivatedRouteSnapshot): boolean {
        return false;
    }

    store(before: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void { }

    retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
        return null;
    }

    shouldAttach(route: ActivatedRouteSnapshot): boolean {
        return false;
    }

    shouldDetach(route: ActivatedRouteSnapshot): boolean {
        return false;
    }
}
