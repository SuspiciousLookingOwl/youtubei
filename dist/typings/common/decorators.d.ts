interface Constructor<T> {
    new (...args: any[]): T;
}
export declare function extendsBuiltIn(): (target: Constructor<any>) => any;
export {};
