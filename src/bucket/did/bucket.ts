export const idlFactory = ({ IDL }) => {
  const StoreArgs = IDL.Record({
    'key' : IDL.Text,
    'value' : IDL.Vec(IDL.Nat8),
    'total_index' : IDL.Nat,
    'file_type' : IDL.Text,
    'is_http_open' : IDL.Bool,
    'total_size' : IDL.Nat64,
    'index' : IDL.Nat,
  });
  const Bucket = IDL.Service({
    'addAdmin' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'changeAdmin' : IDL.Func([IDL.Vec(IDL.Principal)], [IDL.Bool], []),
    'get' : IDL.Func(
      [IDL.Text, IDL.Nat],
      [IDL.Opt(IDL.Tuple(IDL.Vec(IDL.Nat8), IDL.Text))],
      ['query'],
    ),
    'getAdmins' : IDL.Func([], [IDL.Vec(IDL.Principal)], ['query']),
    'getAssets' : IDL.Func(
      [],
      [
        IDL.Vec(
          IDL.Tuple(
            IDL.Text,
            IDL.Tuple(
              IDL.Vec(IDL.Tuple(IDL.Nat64, IDL.Nat64)),
              IDL.Text,
              IDL.Nat,
              IDL.Bool,
            ),
          )
        ),
      ],
      ['query'],
    ),
    'getBuffers' : IDL.Func([], [IDL.Vec(IDL.Text)], ['query']),
    'getFileTotalIndex' : IDL.Func([IDL.Text], [IDL.Nat], ['query']),
    'store' : IDL.Func([StoreArgs], [], []),
  });
  return Bucket;
};
export const init = ({ IDL }) => { return []; };
