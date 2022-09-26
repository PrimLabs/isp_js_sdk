## isp_js_sdk
isp&amp;icsp js sdk

## Get Start

### Install
`npm install js-isp`

### Usage
```js
import {ICSP, ISP} from "js-isp";
import {HttpAgent} from "@dfinity/agent";
import {authClient} from "@/utils/getAgent/identity";

(async () => {
  /*
  * ic agent:
  * if plug maybe : await window.ic.plug.agent
  */
  const agent = new HttpAgent({
    identity: await authClient.getIdentity(),
    host: "https://ic0.app"
  });
  const ispApi = new ISP(agent)
  /*
  *subAccount:account in isp
  *   You should recharge ICP to this account to create icsp or topup icsp
  */
  const subAccount = await ispApi.get_sub_account()


  //create icsp: two ways
  /*
  * 1、
  * create icsp and topup use ICP
  * @arguments:
  *    icspName:the name of icsp
  *    icp_to_create_amount:the amount to create icsp(Suggestion:>0.2icp)
  *    icp_to_topup_amount:the amount to topup this icsp(1icp ≈ 4.7T Cycle)
  * @return:
  *    craeteICSPRes1 :Result_1== { 'ok': Principal } | { 'err': Error}
  * */
  const createICSPRes1 = await ispApi.create_icsp_topup_by_icp({
    icspName: "first",
    icp_to_create_amount: {e8s: BigInt(0.2 * 1e8)},
    icp_to_topup_amount: {e8s: BigInt(0.2 * 1e8)}
  })

  /*
  * 2、
  * create icsp and topup use XTC
  * @arguments:
  *    icspName:the name of icsp
  *    icp_to_create_amount:the amount to create icsp(Suggestion:>0.2icp)
  *    xtc_to_topup_amount:the amount to topup this icsp(1 xtc = 1T Cycle)
  * @return:
  *    craeteICSPRes2 : CreateRes = {
            icspCanisterId: Result_1;
            burnTransactionId: BurnResult;
        };
  * !!attention:
  *    create icsp use the balance of subAccount
  *    topup up use the balance of xtc ,So you should prepare enough xtc in principal in advance（principal not the subAccount）
  *
  * Best Practices:
  *    Add icp to subAccount to create icsp（maybe 0.2 icp）
  *    Use https://app.sonic.ooo/swap to exchange cheap xtc for plug wallet（1 icp ≈ 15.7 xtc）
  *
  * then call this function to create icsp.
  *
  * */
  const createICSPRes2 = await ispApi.create_icsp_topup_by_xtc({
    icspName: "first",
    icp_to_create_amount: {e8s: BigInt(0.2 * 1e8)},
    xtc_to_topup_amount: {e8s: BigInt(2 * 1e12)}
  }) as any

  const cai = createICSPRes2.icspCanisterId.ok
  const icspApi = new ICSP(cai, agent)
  /*
  * initialize icsp
  * @return:
  *   initRes:LiveBucketExt={
      'used_memory': bigint;
      'canister_id': Principal;
    }
  * canister_id is the first bucket to store file
  * if canister_id === icsp_canisterId means init failed
  * 
  * */
  const initRes = await icspApi.init()
  // get the icsp_balance
  const cycle = await icspApi.get_cycle_balance()
  const fileArr: File[] = []
  /*
  * store file
  * @argument :
  *   fileArr:file array to upload
  *   is_http_open:Is this file accessible via http
  * */
  await icspApi.store_file(fileArr, true)

  /*
  * get file_blob
  *
  * @argument the file_key
  *
  * @return : file_blob
  * */
  const blob = await icspApi.get_file("fcShISH0Ootg-IN3M9VKL")

})()
```

## API

### ISP
- [`get_user_icsps()`](#get_user_icsps)
- [`get_sub_account()`](#get_sub_account)
- [`get_icp_balance()`](#get_icp_balance)
- [`transfer_out_icp()`](#transfer_out_icp)
- [`create_icsp_topup_by_xtc()`](#create_icsp_topup_by_xtc)
- [`create_icsp_topup_by_icp()`](#create_icsp_topup_by_icp)
- [`transfer_out_icp()`](#transfer_out_icp)

#### `get_user_icsps()`

```typescript
get_user_icsps(): Promise<icsp[]>
export declare type icsp = [string, Principal];
```

#### `get_sub_account()`
#### `get_icp_balance()`
#### `transfer_out_icp()`
#### `create_icsp_topup_by_xtc()`
#### `create_icsp_topup_by_icp()`
#### `transfer_out_icp()`

