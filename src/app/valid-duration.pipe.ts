import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'validDuration',
})
export class ValidDurationPipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): string | undefined {
    if (!value) return undefined;

    let splitted = value.split(':');
    let [min, sec] = [splitted.at(-2), splitted.at(-1)];
    const secNum = Number.parseInt(sec || '00');
    const minNum = Number.parseInt(min || '00');

    if (secNum < 10) sec = '0' + sec;

    return `${minNum}:${sec}`;
  }
}
