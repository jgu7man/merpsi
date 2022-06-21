import { IsCreditNotePipe } from './is-credit-note.pipe';

describe('IsCreditNotePipe', () => {
  it('create an instance', () => {
    const pipe = new IsCreditNotePipe();
    expect(pipe).toBeTruthy();
  });
});
