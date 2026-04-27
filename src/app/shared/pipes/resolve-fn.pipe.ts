import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'resolveFn',
  standalone: true,
  pure: true, // Pure = Angular solo recalcula si cambian las referencias
})
export class ResolveFnPipe implements PipeTransform {
  transform<T, R>(value: R | ((row: T) => R), row: T): R {
    return typeof value === 'function' ? (value as (row: T) => R)(row) : value;
  }
}
