import {idlFactory as ICSPIDL} from "./did/icsp"
import {Actor, ActorMethod, ActorSubclass, HttpAgent} from "@dfinity/agent";
import {allFiles, getBucketOfFileRes, getBucketsRes} from "../types";
import {nanoid} from 'nanoid'
import {FileBufExt, LiveBucketExt, OtherFile, StoreArgs} from "./did/icsp_type";
import {Bucket} from "../bucket";

const chunkSize = 1992288

export class ICSP {
  private readonly agent: HttpAgent
  private readonly icspCanisterId: string
  private readonly ICSPActor: ActorSubclass<Record<string, ActorMethod<unknown[], unknown>>>

  constructor(icspCanisterId: string, agent: HttpAgent) {
    this.agent = agent
    this.icspCanisterId = icspCanisterId
    this.ICSPActor = Actor.createActor(ICSPIDL, {agent, canisterId: this.icspCanisterId})
  }

  async getBucketActor(canisterId: string): Promise<ActorSubclass<Record<string, ActorMethod<unknown[], unknown>>>> {
    try {
      return Actor.createActor(ICSPIDL, {agent: this.agent, canisterId})
    } catch (e) {
      throw e
    }
  }

  async get_cycle_balance(): Promise<bigint> {
    try {
      return (await this.ICSPActor.getCycleBalance()) as bigint
    } catch (e) {
      throw e
    }
  }

  async init(): Promise<LiveBucketExt> {
    try {
      return await this.ICSPActor.init() as LiveBucketExt
    } catch (e) {
      throw e
    }
  }

  async allFiles(): Promise<allFiles> {
    try {
      const allFiles = await Promise.all([this.getAllArFileKey(), this.getAllIcFileKey(), this.getAllIpfsFileKey()])
      return {
        ArFiles: allFiles[0],
        ICFiles: allFiles[1],
        IPFSFiles: allFiles[2]
      }
    } catch (e) {
      throw e
    }
  }

  async getFileInfo(key: string): Promise<FileBufExt> {
    try {
      return await this.ICSPActor.getFileInfo(key) as FileBufExt
    } catch (e) {
      throw e
    }
  }

  async getAllArFileKey(): Promise<string[]> {
    try {
      return await this.ICSPActor.getAllArFileKey() as Array<string>
    } catch (e) {
      throw e
    }
  }

  async getAllIcFileKey(): Promise<string[]> {
    try {
      return await this.ICSPActor.getAllIcFileKey() as Array<string>
    } catch (e) {
      throw e
    }
  }

  async getAllIpfsFileKey(): Promise<string[]> {
    try {
      return await this.ICSPActor.getAllIpfsFileKey() as Array<string>
    } catch (e) {
      throw e
    }
  }

  async recordFile(OtherFile: OtherFile) {
    try {
      return await this.ICSPActor.recordFile(OtherFile)
    } catch (e) {
      throw e
    }
  }

  /*
  * @argument
  *   file_key:the unique key of file
  *
  * @return
  *   the bucket store this file
  * */
  public async get_bucket_of_file(file_key: string): Promise<getBucketOfFileRes> {
    try {
      return (await this.ICSPActor.getBucketOfFile(file_key)) as getBucketOfFileRes
    } catch (e) {
      throw e
    }
  }

  /*
  * @return: All buckets under this icsp
  * */
  public async get_icsp_buckets(): Promise<getBucketsRes> {
    try {
      return (await this.ICSPActor.getBuckets()) as getBucketsRes
    } catch (e) {
      throw e
    }
  }

  public async storeString(dataArr: string[], is_http_open: boolean): Promise<string[]> {
    try {
      const keyArr: Array<string> = []
      const Actor = this.ICSPActor
      const allPromise: Array<any> = []
      for (let i = 0; i < dataArr.length; i++) {
        const file = dataArr[i]
        const key = nanoid()
        keyArr.push(key)
        const data = new TextEncoder().encode(file);
        const arg: StoreArgs = {
          key,
          value: data,
          file_type: "text/plain",
          index: BigInt(0),
          total_index: BigInt(1),
          total_size: BigInt(data.length),
          is_http_open
        }
        allPromise.push(Actor.store(arg))
      }
      await Promise.all(allPromise)
      return keyArr
    } catch (e) {
      throw  e
    }
  }

  public async storeBlob(files: File[], is_http_open: boolean): Promise<string[]> {
    try {
      const keyArr: Array<string> = []
      const Actor = this.ICSPActor
      const allPromise: Array<any> = []
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const key = nanoid()
        keyArr.push(key)
        const total_size = file.size
        const total_index = Math.ceil(total_size / chunkSize)
        const file_type = file.type
        let start = 0;
        let currentChunk = 0;
        const allData: Array<Uint8Array> = []
        let blobSlice = //@ts-ignore
          File.prototype.slice ||
          //@ts-ignore
          File.prototype.mozSlice ||
          //@ts-ignore
          File.prototype.webkitSlice;
        let reader = new FileReader();
        reader.onload = async function (e: any) {
          const data = new Uint8Array(e.target.result)
          allData.push(data)
          if (currentChunk === total_index) {
            for (let i = 0; i < allData.length; i++) {
              const arg: StoreArgs = {
                key,
                value: allData[i],
                file_type,
                index: BigInt(i),
                total_index: BigInt(total_index),
                total_size: BigInt(total_size),
                is_http_open
              }
              allPromise.push(Actor.store(arg))
            }
            if (i === files.length - 1) {
              await Promise.all(allPromise)
              return keyArr
            }
          } else loadChunk()
        };
        const loadChunk = () => {
          const end = start + chunkSize;
          currentChunk++;
          reader.readAsArrayBuffer(blobSlice.call(file, start, end));
          start = end;
        };
        loadChunk();
      }
      return keyArr
    } catch (e) {
      throw e
    }
  }

  /*
  * @argument:
  *   metadata:metadata to upload
  *   is_http_open:Is it possible to access via http
  *@return :null
  * */
  public async store_file(metadata: File[] | string[], is_http_open: boolean): Promise<string[]> {
    try {
      if (typeof (metadata[0]) === "string") {
        return await this.storeString(metadata as string[], is_http_open)
      } else {
        return await this.storeBlob(metadata as File[], is_http_open)
      }
    } catch (e) {
      throw e
    }
  }

  public async get_file(fileKey: string): Promise<Blob | string> {
    try {
      const bucket = (await this.get_bucket_of_file(fileKey))[0]
      if (bucket) {
        const bucketApi = new Bucket(String(bucket), this.agent)
        return await bucketApi.get_file(fileKey)
      } else {
        throw new Error("There is no bucket to store this file")
      }
    } catch (e) {
      throw e
    }
  }
}
