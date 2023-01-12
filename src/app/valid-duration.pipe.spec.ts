import { ValidDurationPipe } from './valid-duration.pipe';

describe('ValidDurationPipe', () => {
  it('create an instance', () => {
    const pipe = new ValidDurationPipe();
    expect(pipe).toBeTruthy();
  });
});
