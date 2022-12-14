import type {Principal} from '@dfinity/principal';
import type {ActorMethod} from '@dfinity/agent';

export type AccountIdentifier = Array<number>;
export type BlockIndex = bigint;
export type Error = { 'Create_Canister_Failed': bigint } |
  { 'Ledger_Transfer_Failed': bigint } |
  { 'Unauthorized': null };

export interface ISP {
  'addAdmin': ActorMethod<[Principal], boolean>,
  'changeAdmins': ActorMethod<[Array<Principal>], boolean>,
  'clearLog': ActorMethod<[], undefined>,
  'createICSP': ActorMethod<[string, bigint], Result_1>,
  'getAdmins': ActorMethod<[], Array<Principal>>,
  'getLog': ActorMethod<[], Array<[bigint, string]>>,
  'getSubAccount': ActorMethod<[], AccountIdentifier>,
  'getUserICSPs': ActorMethod<[], Array<[string, Principal]>>,
  'getUserSubAccountICPBalance': ActorMethod<[], bigint>,
  'getVersion': ActorMethod<[], string>,
  'topUpICSP': ActorMethod<[TopUpArgs], Result>,
  'topUpSelf': ActorMethod<[Principal], undefined>,
  'transferOutUserSubAccountICP': ActorMethod<[AccountIdentifier, bigint],
    TransferResult>,
  'updateICSPWasm': ActorMethod<[Array<number>, string], string>,
  'upgradeICSP': ActorMethod<[Principal], boolean>,
  'wallet_receive': ActorMethod<[], undefined>,
}

export type Result = { 'ok': null } |
  { 'err': Error };
export type Result_1 = { 'ok': Principal } |
  { 'err': Error };

export interface Token {
  'e8s': bigint
}

export interface TopUpArgs {
  'icsp_canisterId': Principal,
  'icp_amount': bigint,
}

export type TransferError = {
  'TxTooOld': { 'allowed_window_nanos': bigint }
} |
  { 'BadFee': { 'expected_fee': Token } } |
  { 'TxDuplicate': { 'duplicate_of': BlockIndex } } |
  { 'TxCreatedInFuture': null } |
  { 'InsufficientFunds': { 'balance': Token } };
export type TransferResult = { 'Ok': BlockIndex } |
  { 'Err': TransferError };

export interface _SERVICE extends ISP {
}
