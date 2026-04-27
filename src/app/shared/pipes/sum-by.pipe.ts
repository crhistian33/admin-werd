import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sumBy',
  standalone: true,
})
export class SumByPipe implements PipeTransform {
  transform(items: any[] | null | undefined, attr: string): number {
    if (!items || !Array.isArray(items)) return 0;
    return items.reduce((a, b) => a + (Number(b[attr]) || 0), 0);
  }
}
