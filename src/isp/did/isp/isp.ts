export const idlFactory = ({IDL}) => {
  const Error = IDL.Variant({
    'Create_Canister_Failed': IDL.Nat,
    'Ledger_Transfer_Failed': IDL.Nat,
    'Unauthorized': IDL.Null,
  });
  const Result_1 = IDL.Variant({'ok': IDL.Principal, 'err': Error});
  const AccountIdentifier = IDL.Vec(IDL.Nat8);
  const TopUpArgs = IDL.Record({
    'icsp_canisterId': IDL.Principal,
    'icp_amount': IDL.Nat64,
  });
  const Result = IDL.Variant({'ok': IDL.Null, 'err': Error});
  const BlockIndex = IDL.Nat64;
  const Token = IDL.Record({'e8s': IDL.Nat64});
  const TransferError = IDL.Variant({
    'TxTooOld': IDL.Record({'allowed_window_nanos': IDL.Nat64}),
    'BadFee': IDL.Record({'expected_fee': Token}),
    'TxDuplicate': IDL.Record({'duplicate_of': BlockIndex}),
    'TxCreatedInFuture': IDL.Null,
    'InsufficientFunds': IDL.Record({'balance': Token}),
  });
  const TransferResult = IDL.Variant({
    'Ok': BlockIndex,
    'Err': TransferError,
  });
  const ISP = IDL.Service({
    'addAdmin': IDL.Func([IDL.Principal], [IDL.Bool], []),
    'changeAdmins': IDL.Func([IDL.Vec(IDL.Principal)], [IDL.Bool], []),
    'clearLog': IDL.Func([], [], []),
    'createICSP': IDL.Func([IDL.Text, IDL.Nat64], [Result_1], []),
    'getAdmins': IDL.Func([], [IDL.Vec(IDL.Principal)], ['query']),
    'getLog': IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Nat, IDL.Text))], ['query']),
    'getSubAccount': IDL.Func([], [AccountIdentifier], ['query']),
    'getUserICSPs': IDL.Func(
      [],
      [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Principal))],
      ['query'],
    ),
    'getUserSubAccountICPBalance': IDL.Func([], [IDL.Nat64], []),
    'getVersion': IDL.Func([], [IDL.Text], ['query']),
    'topUpICSP': IDL.Func([TopUpArgs], [Result], []),
    'topUpSelf': IDL.Func([IDL.Principal], [], []),
    'transferOutUserSubAccountICP': IDL.Func(
      [AccountIdentifier, IDL.Nat64],
      [TransferResult],
      [],
    ),
    'updateICSPWasm': IDL.Func([IDL.Vec(IDL.Nat8), IDL.Text], [IDL.Text], []),
    'upgradeICSP': IDL.Func([IDL.Principal], [IDL.Bool], []),
    'wallet_receive': IDL.Func([], [], []),
  });
  return ISP;
};
export const init = ({IDL}) => {
  return [];
};
