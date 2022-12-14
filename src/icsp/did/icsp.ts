export const idlFactory = ({ IDL }) => {
  const BucketStatusExt__1 = IDL.Record({
    'used_memory' : IDL.Nat,
    'canister_id' : IDL.Principal,
  });
  const Buckets = IDL.Record({
    'live_buckets' : IDL.Vec(BucketStatusExt__1),
    'dead_buckets' : IDL.Vec(BucketStatusExt__1),
  });
  const FileBufExt = IDL.Record({
    'bucket_id' : IDL.Principal,
    'total_index' : IDL.Nat,
    'wrote_page' : IDL.Vec(IDL.Bool),
    'file_type' : IDL.Text,
    'is_http_open' : IDL.Bool,
    'total_size' : IDL.Nat64,
    'received' : IDL.Nat,
  });
  const FileLocation__1 = IDL.Variant({
    'IPFS' : IDL.Null,
    'Arweave' : IDL.Null,
  });
  const FileLocation = IDL.Variant({ 'IPFS' : IDL.Null, 'Arweave' : IDL.Null });
  const OtherFile = IDL.Record({
    'file_location' : FileLocation,
    'file_key' : IDL.Text,
    'file_url' : IDL.Text,
    'file_type' : IDL.Text,
  });
  const HeaderField = IDL.Tuple(IDL.Text, IDL.Text);
  const HttpRequest = IDL.Record({
    'url' : IDL.Text,
    'method' : IDL.Text,
    'body' : IDL.Vec(IDL.Nat8),
    'headers' : IDL.Vec(HeaderField),
  });
  const CallbackToken = IDL.Record({
    'key' : IDL.Text,
    'total_index' : IDL.Nat,
    'index' : IDL.Nat,
  });
  const StreamingCallbackHttpResponse = IDL.Record({
    'token' : IDL.Opt(CallbackToken),
    'body' : IDL.Vec(IDL.Nat8),
  });
  const StreamStrategy = IDL.Variant({
    'Callback' : IDL.Record({
      'token' : CallbackToken,
      'callback' : IDL.Func(
        [CallbackToken],
        [StreamingCallbackHttpResponse],
        ['query'],
      ),
    }),
  });
  const HttpResponse = IDL.Record({
    'body' : IDL.Vec(IDL.Nat8),
    'headers' : IDL.Vec(HeaderField),
    'streaming_strategy' : IDL.Opt(StreamStrategy),
    'status_code' : IDL.Nat16,
  });
  const BucketStatusExt = IDL.Record({
    'used_memory' : IDL.Nat,
    'canister_id' : IDL.Principal,
  });
  const DataErr = IDL.Variant({
    'CycleNotEnough' : IDL.Null,
    'BucketEnough' : IDL.Null,
  });
  const Result = IDL.Variant({ 'ok' : BucketStatusExt, 'err' : DataErr });
  const StoreArgs = IDL.Record({
    'key' : IDL.Text,
    'value' : IDL.Vec(IDL.Nat8),
    'total_index' : IDL.Nat,
    'file_type' : IDL.Text,
    'is_http_open' : IDL.Bool,
    'total_size' : IDL.Nat64,
    'index' : IDL.Nat,
  });
  const icsp = IDL.Service({
    'addAdmin' : IDL.Func([IDL.Principal], [], []),
    'delete' : IDL.Func([IDL.Text], [], []),
    'deleteAdmin' : IDL.Func([IDL.Principal], [], []),
    'getAdmins' : IDL.Func([], [IDL.Vec(IDL.Principal)], ['query']),
    'getAllArFileKey' : IDL.Func([], [IDL.Vec(IDL.Text)], ['query']),
    'getAllIcFileKey' : IDL.Func([], [IDL.Vec(IDL.Text)], ['query']),
    'getAllIpfsFileKey' : IDL.Func([], [IDL.Vec(IDL.Text)], ['query']),
    'getBucketOfFile' : IDL.Func(
      [IDL.Text],
      [IDL.Opt(IDL.Principal)],
      ['query'],
    ),
    'getBuckets' : IDL.Func([], [IDL.Opt(Buckets)], ['query']),
    'getCycleBalance' : IDL.Func([], [IDL.Nat], ['query']),
    'getFieldFileInfos' : IDL.Func(
      [IDL.Nat, IDL.Nat],
      [IDL.Vec(FileBufExt)],
      ['query'],
    ),
    'getFileInfo' : IDL.Func([IDL.Text], [IDL.Opt(FileBufExt)], ['query']),
    'getIcFileNums' : IDL.Func([], [IDL.Opt(IDL.Nat)], ['query']),
    'getOtherFile' : IDL.Func(
      [IDL.Text, FileLocation__1],
      [IDL.Opt(OtherFile)],
      ['query'],
    ),
    'getVersion' : IDL.Func([], [IDL.Text], ['query']),
    'http_request' : IDL.Func([HttpRequest], [HttpResponse], ['query']),
    'init' : IDL.Func([], [Result], []),
    'recordFile' : IDL.Func([OtherFile], [], []),
    'store' : IDL.Func([StoreArgs], [], []),
    'topUpBucket' : IDL.Func([IDL.Nat], [], []),
    'updateVersion' : IDL.Func([IDL.Text], [IDL.Bool], []),
    'wallet_receive' : IDL.Func([], [IDL.Nat], []),
  });
  return icsp;
};
export const init = ({ IDL }) => { return []; };
