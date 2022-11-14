import type {Principal} from '@dfinity/principal';
import type {ActorMethod} from '@dfinity/agent';

export interface BucketStatusExt {
  'used_memory': bigint,
  'canister_id': Principal,
}

export interface BucketStatusExt__1 {
  'used_memory': bigint,
  'canister_id': Principal,
}

export interface Buckets {
  'live_buckets': Array<BucketStatusExt__1>,
  'dead_buckets': Array<BucketStatusExt__1>,
}

export interface CallbackToken {
  'key': string,
  'total_index': bigint,
  'index': bigint,
}

export type DataErr = { 'CycleNotEnough': null } |
  { 'BucketEnough': null };

export interface FileBufExt {
  'bucket_id': Principal,
  'total_index': bigint,
  'wrote_page': Array<boolean>,
  'file_type': string,
  'is_http_open': boolean,
  'total_size': bigint,
  'received': bigint,
}

export type FileLocation = { 'IPFS': null } |
  { 'Arweave': null };
export type FileLocation__1 = { 'IPFS': null } |
  { 'Arweave': null };
export type HeaderField = [string, string];

export interface HttpRequest {
  'url': string,
  'method': string,
  'body': Array<number>,
  'headers': Array<HeaderField>,
}

export interface HttpResponse {
  'body': Array<number>,
  'headers': Array<HeaderField>,
  'streaming_strategy': [] | [StreamStrategy],
  'status_code': number,
}

export interface OtherFile {
  'file_location': FileLocation,
  'file_key': string,
  'file_url': string,
  'file_type': string,
}

export type Result = { 'ok': BucketStatusExt } |
  { 'err': DataErr };

export interface StoreArgs {
  'key': string,
  'value': Array<number> | Uint8Array,
  'total_index': bigint,
  'file_type': string,
  'is_http_open': boolean,
  'total_size': bigint,
  'index': bigint,
}

export type StreamStrategy = {
  'Callback': { 'token': CallbackToken, 'callback': [Principal, string] }
};

export interface StreamingCallbackHttpResponse {
  'token': [] | [CallbackToken],
  'body': Array<number>,
}

export interface icsp {
  'addAdmin': ActorMethod<[Principal], undefined>,
  'delete': ActorMethod<[string], undefined>,
  'deleteAdmin': ActorMethod<[Principal], undefined>,
  'getAdmins': ActorMethod<[], Array<Principal>>,
  'getAllArFileKey': ActorMethod<[], Array<string>>,
  'getAllIcFileKey': ActorMethod<[], Array<string>>,
  'getAllIpfsFileKey': ActorMethod<[], Array<string>>,
  'getBucketOfFile': ActorMethod<[string], [] | [Principal]>,
  'getBuckets': ActorMethod<[], [] | [Buckets]>,
  'getCycleBalance': ActorMethod<[], bigint>,
  'getFieldFileInfos': ActorMethod<[bigint, bigint], Array<FileBufExt>>,
  'getFileInfo': ActorMethod<[string], [] | [FileBufExt]>,
  'getIcFileNums': ActorMethod<[], [] | [bigint]>,
  'getOtherFile': ActorMethod<[string, FileLocation__1], [] | [OtherFile]>,
  'getVersion': ActorMethod<[], string>,
  'http_request': ActorMethod<[HttpRequest], HttpResponse>,
  'init': ActorMethod<[], Result>,
  'recordFile': ActorMethod<[OtherFile], undefined>,
  'store': ActorMethod<[StoreArgs], undefined>,
  'topUpBucket': ActorMethod<[bigint], undefined>,
  'updateVersion': ActorMethod<[string], boolean>,
  'wallet_receive': ActorMethod<[], bigint>,
}

export interface _SERVICE extends icsp {
}
