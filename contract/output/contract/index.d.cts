import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export type Witnesses<T> = {
}

export type ImpureCircuits<T> = {
  newGame(context: __compactRuntime.CircuitContext<T>,
          plOne: Uint8Array,
          plTwo: Uint8Array): __compactRuntime.CircuitResults<T, void>;
}

export type PureCircuits = {
}

export type Circuits<T> = {
  newGame(context: __compactRuntime.CircuitContext<T>,
          plOne: Uint8Array,
          plTwo: Uint8Array): __compactRuntime.CircuitResults<T, void>;
}

export type Ledger = {
  readonly gameStarted: boolean;
  readonly cellState: number;
  grid: {
    isEmpty(): boolean;
    size(): bigint;
    member(key: bigint): boolean;
    lookup(key: bigint): number;
    [Symbol.iterator](): Iterator<[bigint, number]>
  };
  readonly playerOne: Uint8Array;
  readonly playerTwo: Uint8Array;
}

export type ContractReferenceLocations = any;

export declare const contractReferenceLocations : ContractReferenceLocations;

export declare class Contract<T, W extends Witnesses<T> = Witnesses<T>> {
  witnesses: W;
  circuits: Circuits<T>;
  impureCircuits: ImpureCircuits<T>;
  constructor(witnesses: W);
  initialState(context: __compactRuntime.ConstructorContext<T>): __compactRuntime.ConstructorResult<T>;
}

export declare function ledger(state: __compactRuntime.StateValue): Ledger;
export declare const pureCircuits: PureCircuits;
