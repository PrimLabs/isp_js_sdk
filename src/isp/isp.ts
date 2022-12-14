import {Actor, ActorMethod, ActorSubclass, HttpAgent} from "@dfinity/agent"
import {idlFactory as ISPIDL} from "./did/isp/isp"
import {idlFactory as XTCIDL} from "./did/xtc/xtc"
import {idlFactory as WICPIDL} from "./did/wicp/wicp";
import {idlFactory as LedgerIDL} from "./did/ledger/ledger"
import {burnArg, createByIcpArg, createByXTCArg, CreateRes, icsp} from "../types";
import {AccountIdentifier, Result_1, TopUpArgs} from "./did/isp/isp_type";
import {Result} from "./did/wicp/wicp_type"
import {ArrayToHexString, getUint8ArrayFromHex} from "../utils/common"
import {Principal} from "@dfinity/principal";
import {BurnResult, MintResult} from "./did/xtc/xtc_type";
import {ICP, TransferResult} from "./did/ledger/ledger_type";
import {ICSP} from "../icsp";

const ISPCanisterId = "p2pki-xyaaa-aaaan-qatua-cai"
const XTCCanisterId = "aanaa-xaaaa-aaaah-aaeiq-cai"
const WICPCanisterId = "utozz-siaaa-aaaam-qaaxq-cai"
const LedgerCanisterId = "ryjl3-tyaaa-aaaaa-aaaba-cai"
const WICPAccount = "cc659fe529756bae6f72db9937c6c60cf7ad57eb4ac5f930a75748927aab469a"

export class ISP {
  private readonly canisterId = ISPCanisterId
  private readonly agent: HttpAgent
  private readonly ISPActor: ActorSubclass<Record<string, ActorMethod<unknown[], unknown>>>

  constructor(agent: HttpAgent) {
    this.agent = agent
    this.ISPActor = Actor.createActor(ISPIDL, {agent, canisterId: this.canisterId})
  }

  public async getXTCActor() {
    return Actor.createActor(XTCIDL, {agent: this.agent, canisterId: XTCCanisterId})
  }

  public async getWICPActor() {
    return Actor.createActor(WICPIDL, {agent: this.agent, canisterId: WICPCanisterId})
  }

  public async getLedgerActor() {
    return Actor.createActor(LedgerIDL, {agent: this.agent, canisterId: LedgerCanisterId})
  }

  public async get_user_icsps(): Promise<icsp[]> {
    try {
      return (await this.ISPActor.getUserICSPs()) as Array<icsp>
    } catch (e) {
      throw e
    }
  }

  public async get_sub_account(): Promise<string> {
    try {
      const userSubAccount = (await this.ISPActor.getSubAccount()) as AccountIdentifier
      return ArrayToHexString(userSubAccount)
    } catch (e) {
      throw e
    }
  }

  public async get_icp_balance(): Promise<bigint> {
    try {
      return (await this.ISPActor.getUserSubAccountICPBalance()) as bigint
    } catch (e) {
      throw e
    }
  }

  public async transfer_out_icp(accountAdress: string, amount: { e8s: bigint }): Promise<bigint> {
    try {
      const u8Account = getUint8ArrayFromHex(accountAdress)
      return (await this.ISPActor.transferOutUserSubAccountICP(Array.from(u8Account), amount.e8s)) as bigint
    } catch (e) {
      throw e
    }
  }


  /*
  * @argument
  *   icspName:the name of icsp
  *
  *   icp_to_create_amount:e8s icp amount to create canister
  *
  *   xtc_to_topup_amount:e8s icp amount burn xtc to topup canister
  */
  public async create_icsp_topup_by_xtc(createArgs: createByXTCArg): Promise<CreateRes> {
    try {
      const icspCai = await this.CreateIcsp(createArgs.icspName, createArgs.icp_to_create_amount) as any
      if (icspCai.ok) {
        const burnRes = await this.top_up_icsp_with_xtc(icspCai.ok, createArgs.xtc_to_topup_amount.e8s) as any
        if (burnRes.Ok) {
          return {
            icspCanisterId: icspCai,
            burnTransactionId: burnRes
          }
        } else throw new Error(Object.keys(burnRes.Err)[0])
      } else throw new Error(Object.keys(icspCai.err)[0])
    } catch (e) {
      throw e
    }
  }

  public async create_icsp_topup_by_icp(createArgs: createByIcpArg): Promise<Result_1> {
    try {
      const icspCai = await this.CreateIcsp(createArgs.icspName, createArgs.icp_to_create_amount) as any
      if (icspCai.ok) {
        const burnRes = await this.top_up_icsp({
          icsp_canisterId: icspCai.ok,
          icp_amount: createArgs.icp_to_topup_amount.e8s
        }) as any
        if (Object.keys(burnRes)[0] === "ok") return icspCai
        else throw new Error(Object.keys(burnRes.err)[0])
      } else throw new Error(Object.keys(icspCai.err)[0])
    } catch (e) {
      throw e
    }
  }

  public async CreateIcsp(icspName: string, icp_to_create_amount: { e8s: bigint }): Promise<Result_1> {
    try {
      return (await this.ISPActor.createICSP(icspName, icp_to_create_amount.e8s)) as Result_1
    } catch (e) {
      throw e
    }
  }


  public async top_up_icsp_with_xtc(canisterId: Principal, amount: bigint): Promise<BurnResult> {
    try {
      const Actor = await this.getXTCActor()
      const burnArgs: burnArg = {
        canister_id: canisterId,
        amount: amount
      }
      return await Actor.burn(burnArgs) as BurnResult
    } catch (e) {
      throw e
    }
  }

  /*
  * @argument
  *   icsp_canisterId:the canisterPrincipal of icsp
  *
  *   icp_amount:e8s icp amount
  */
  public async top_up_icsp(topUpArg: TopUpArgs): Promise<Result> {
    try {
      return (await this.ISPActor.topUpICSP(topUpArg)) as Result
    } catch (e) {
      throw e
    }
  }

  public async getVersion(): Promise<string> {
    try {
      return (await this.ISPActor.getVersion()) as string
    } catch (e) {
      throw  e
    }
  }

}
