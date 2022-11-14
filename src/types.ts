import {Principal} from "@dfinity/principal";
import {Buckets, FileBufExt} from "./icsp/did/icsp_type";
import {Result_1} from "./isp/did/isp/isp_type";
import {BurnResult} from "./isp/did/xtc/xtc_type";

export type icsp = [string, Principal]

export type createByXTCArg = {
  icspName: string,
  icp_to_create_amount: { e8s: bigint } // e8s eg: 1icp => 1*e8s
  xtc_to_topup_amount: { e8s: bigint } // e8s eg: 2*1e12 => 2T cycle
}

export type createByIcpArg = {
  icspName: string,
  icp_to_create_amount: { e8s: bigint } // e8s eg: 1icp => 1*e8s
  icp_to_topup_amount: { e8s: bigint } // e8s eg: 1icp => 4T cycle
}

export type getBucketOfFileRes = [] | [Principal]

export type getFileInfoRes = [] | [FileBufExt]

export type getBucketsRes = [] | [Buckets]

export type getRes = [] | [[Array<number>, string]]

export type burnArg = { 'canister_id': Principal, 'amount': bigint }

export type CreateRes = {
  icspCanisterId: Result_1
  burnTransactionId: BurnResult
}

export type allFiles = {
  ArFiles: string[]
  ICFiles: string[]
  IPFSFiles: string[]
}
