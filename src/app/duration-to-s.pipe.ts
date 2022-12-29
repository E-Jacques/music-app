import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'durationToS',
})
export class DurationToSPipe implements PipeTransform {
  transform(value?: string | String, ...args: unknown[]): number | undefined {
    if (!value) return undefined;

    const [min, sec] = value.split(':');
    return Number.parseInt(min) * 60 + Number.parseInt(sec);
  }
}
