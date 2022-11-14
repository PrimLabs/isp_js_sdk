import {idlFactory as ICSPIDL} from "./did/icsp"
import {Actor, ActorMethod, ActorSubclass, HttpAgent} from "@dfinity/agent";
import {allFiles, getBucketOfFileRes, getBucketsRes, getFileInfoRes} from "../types";
import {nanoid} from 'nanoid'
import {OtherFile, Result, StoreArgs} from "./did/icsp_type";
import {Bucket} from "../bucket";

const chunkSize = 2031616

export class ICSP {
  private readonly agent: HttpAgent
  private readonly icspCanisterId: string
  private readonly ICSPActor: ActorSubclass<Record<string, ActorMethod<unknown[], unknown>>>

  constructor(icspCanisterId: string, agent: HttpAgent) {
    this.agent = agent
    this.icspCanisterId = icspCanisterId
    this.ICSPActor = Actor.createActor(ICSPIDL, {agent, canisterId: this.icspCanisterId})
  }

  async get_cycle_balance(): Promise<bigint> {
    try {
      return (await this.ICSPActor.getCycleBalance()) as bigint
    } catch (e) {
      throw e
    }
  }

  async init(): Promise<Result> {
    try {
      return await this.ICSPActor.init() as Result
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

  async getFileInfo(key: string): Promise<getFileInfoRes> {
    try {
      return await this.ICSPActor.getFileInfo(key) as getFileInfoRes
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

  public async storeString(dataArr: string[], is_http_open: boolean, key_arr?: string[]): Promise<string[]> {
    try {
      const keyArr: Array<string> = []
      const Actor = this.ICSPActor
      const allPromise: Array<any> = []
      for (let i = 0; i < dataArr.length; i++) {
        const file = dataArr[i]
        const key = key_arr ? key_arr[i] : nanoid()
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

  private async FileRead(file: File | Blob): Promise<Uint8Array[]> {
    try {
      return new Promise((resolve, reject) => {
        let start = 0;
        let currentChunk = 0;
        const total_index = Math.ceil(file.size / chunkSize)
        const allData: Array<Uint8Array> = []
        let blobSlice = //@ts-ignore
          File.prototype.slice ||
          //@ts-ignore
          File.prototype.mozSlice ||
          //@ts-ignore
          File.prototype.webkitSlice;
        let reader = new FileReader();
        reader.onload = async function (e: any) {
          allData.push(new Uint8Array(e.target.result))
          if (currentChunk === total_index) return resolve(allData)
          else loadChunk()
        }
        reader.onerror = (error) => {
          reject(error)
        }
        const loadChunk = () => {
          const end = start + chunkSize;
          currentChunk++;
          reader.readAsArrayBuffer(blobSlice.call(file, start, end));
          start = end;
        };
        loadChunk();
      })
    } catch (e) {
      throw e
    }
  }

  public async storeBlob(files: File[], is_http_open: boolean, key_arr?: string[]): Promise<string[]> {
    try {
      const keyArr: Array<string> = []
      const Actor = this.ICSPActor
      const allPromise: Array<any> = []
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const key = key_arr ? key_arr[i] : nanoid()
        keyArr.push(key)
        const total_size = file.size
        const total_index = Math.ceil(total_size / chunkSize)
        const allData = await this.FileRead(file)
        for (let i = 0; i < allData.length; i++) {
          const arg: StoreArgs = {
            key,
            value: allData[i],
            file_type: file.type,
            index: BigInt(i),
            total_index: BigInt(total_index),
            total_size: BigInt(total_size),
            is_http_open
          }
          allPromise.push(Actor.store(arg))
        }
      }
      await Promise.all(allPromise)
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
  public async store_file(metadata: (File | string)[], is_http_open: boolean, key_arr?: string[]): Promise<string[]> {
    try {
      if (key_arr && metadata.length !== key_arr.length) throw new Error("文件数组和key数组长度不一")
      if (typeof (metadata[0]) === "string") {
        return await this.storeString(metadata as string[], is_http_open, key_arr)
      } else {
        return await this.storeBlob(metadata as File[], is_http_open, key_arr)
      }
    } catch (e) {
      throw e
    }
  }

  public async update_data(key: string, new_data: string | File, is_http_open: boolean): Promise<boolean> {
    try {
      await this.delete_file(key)
      const update_res = await this.store_file([new_data], is_http_open, [key])
      return update_res[0] === key;
    } catch (e) {
      throw e
    }
  }


  public async delete_file(file_key: string) {
    try {
      const Actor = this.ICSPActor
      return await Actor.delete(file_key)
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

  public async getVersion(): Promise<string> {
    try {
      return (await this.ICSPActor.getVersion()) as string
    } catch (e) {
      throw e
    }
  }
}
