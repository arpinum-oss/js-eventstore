import { Transform } from 'stream';

export type Mapping<TIn, TOut> = (input: TIn) => TOut;

export class Mapper<TIn, TOut> extends Transform {
  private mapping: Mapping<TIn, TOut>;

  constructor(mapping: Mapping<TIn, TOut>) {
    super({ objectMode: true });
    this.mapping = mapping;
  }

  // tslint:disable-next-line:variable-name
  public _transform(chunk: TIn, _encoding: string, callback: () => void) {
    this.push(this.mapping(chunk));
    callback();
  }
}

export function streamMapper<TIn, TOut>(mapping: Mapping<TIn, TOut>) {
  return new Mapper(mapping);
}
