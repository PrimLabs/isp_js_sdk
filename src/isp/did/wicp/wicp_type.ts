import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface Metadata {
  'fee' : bigint,
  'decimals' : number,
  'owner' : Principal,
  'logo' : string,
  'name' : string,
  'totalSupply' : bigint,
  'symbol' : string,
}
export type Result = { 'Ok' : bigint } |
  { 'Err' : TxError };
export interface TokenInfo {
  'holderNumber' : bigint,
  'deployTime' : bigint,
  'metadata' : Metadata,
  'historySize' : bigint,
  'cycles' : bigint,
  'feeTo' : Principal,
}
export type TxError = { 'InsufficientAllowance' : null } |
  { 'InsufficientBalance' : null } |
  { 'ErrorOperationStyle' : null } |
  { 'Unauthorized' : null } |
  { 'LedgerTrap' : null } |
  { 'ErrorTo' : null } |
  { 'Other' : null } |
  { 'BlockUsed' : null } |
  { 'AmountTooSmall' : null };
export interface _SERVICE {
  'allowance' : ActorMethod<[Principal, Principal], bigint>,
  'approve' : ActorMethod<[Principal, bigint], Result>,
  'balanceOf' : ActorMethod<[Principal], bigint>,
  'decimals' : ActorMethod<[], number>,
  'getAllowanceSize' : ActorMethod<[], bigint>,
  'getBlockUsed' : ActorMethod<[], Array<bigint>>,
  'getHolders' : ActorMethod<[bigint, bigint], Array<[Principal, bigint]>>,
  'getMetadata' : ActorMethod<[], Metadata>,
  'getTokenInfo' : ActorMethod<[], TokenInfo>,
  'getUserApprovals' : ActorMethod<[Principal], Array<[Principal, bigint]>>,
  'historySize' : ActorMethod<[], bigint>,
  'isBlockUsed' : ActorMethod<[bigint], boolean>,
  'logo' : ActorMethod<[], string>,
  'mint' : ActorMethod<[[] | [Array<number>], bigint], Result>,
  'mintFor' : ActorMethod<[[] | [Array<number>], bigint, Principal], Result>,
  'name' : ActorMethod<[], string>,
  'owner' : ActorMethod<[], Principal>,
  'setFee' : ActorMethod<[bigint], undefined>,
  'setFeeTo' : ActorMethod<[Principal], undefined>,
  'setGenesis' : ActorMethod<[], Result>,
  'setLogo' : ActorMethod<[string], undefined>,
  'setName' : ActorMethod<[string], undefined>,
  'setOwner' : ActorMethod<[Principal], undefined>,
  'symbol' : ActorMethod<[], string>,
  'totalSupply' : ActorMethod<[], bigint>,
  'transfer' : ActorMethod<[Principal, bigint], Result>,
  'transferFrom' : ActorMethod<[Principal, Principal, bigint], Result>,
  'withdraw' : ActorMethod<[bigint, string], Result>,
}
