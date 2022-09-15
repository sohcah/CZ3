import fjss from "fast-json-stable-stringify";
export class Cacher<TData, TInput = string | undefined> {
  private cache: Map<string, [Promise<TData>, number]> = new Map();
  constructor(private func: (input: TInput) => TData | Promise<TData>, private timeout: number) {}

  async get(...input: TInput extends undefined ? [TInput?] : [TInput]): Promise<TData> {
    const key = fjss(input);
    const cached = this.cache.get(key);
    if(cached && Date.now() > cached[1]) {
      return await cached[0];
    }

    const value = this.func(input[0]!);
    this.cache.set(key, [Promise.resolve(value), Date.now() + this.timeout]);
    return value;
  }

  clear() {
    this.cache.clear();
  }
}
