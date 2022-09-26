import type {Principal} from '@dfinity/principal';
import type {ActorMethod} from '@dfinity/agent';

export interface Bucket_type {
  'addAdmin': ActorMethod<[Principal], boolean>,
  'changeAdmin': ActorMethod<[Array<Principal>], boolean>,
  'get': ActorMethod<[string, bigint], [] | [[Array<number>, string]]>,
  'getAdmins': ActorMethod<[], Array<Principal>>,
  'getAssets': ActorMethod<[],
    Array<[string, [Array<[bigint, bigint]>, string, bigint, boolean]]>>,
  'getBuffers': ActorMethod<[], Array<string>>,
  'getFileTotalIndex': ActorMethod<[string], bigint>,
  'store': ActorMethod<[StoreArgs], undefined>,
}

export interface StoreArgs {
  'key': string,
  'value': Array<number>,
  'total_index': bigint,
  'file_type': string,
  'is_http_open': boolean,
  'total_size': bigint,
  'index': bigint,
}

export interface _SERVICE extends Bucket_type {
}
