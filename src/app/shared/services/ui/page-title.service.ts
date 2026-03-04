import { Injectable, signal, inject } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PageTitleService {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  title = signal<string>('');

  constructor() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const title = this.getDeepestTitle(this.activatedRoute);
        this.title.set(title ?? '');
      });
  }

  private getDeepestTitle(route: ActivatedRoute): string {
    let current = route;
    while (current.firstChild) {
      current = current.firstChild;
    }
    return current.snapshot.title ?? '';
  }
}
