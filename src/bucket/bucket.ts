import {idlFactory as bucketIDL} from "./did/bucket"
import {Actor, ActorMethod, ActorSubclass, HttpAgent} from "@dfinity/agent";
import {getRes} from "../types";

export class Bucket {
  private readonly bucketCanisterId: string
  private readonly BucketActor: ActorSubclass<Record<string, ActorMethod<unknown[], unknown>>>

  constructor(canisterId: string, agent: HttpAgent) {
    this.bucketCanisterId = canisterId
    this.BucketActor = Actor.createActor(bucketIDL, {agent, canisterId})
  }

  async getFile(decodeArr: any, length: number): Promise<Uint8Array> {
    const File = new Uint8Array(length)
    for (let i = 0; i < decodeArr.length; i++) {
      let slice = decodeArr[i]
      let start = 0
      for (let j = 0; j < i; j++) {
        start += decodeArr[j].length
      }
      File.set(slice, start)
    }
    return File
  }

  public async get_file(fileKey: string): Promise<Blob | string> {
    try {
      const queryPromiseArr: Array<Promise<any>> = []
      const dataArr: Array<Array<number>> = []
      let fileSize = 0
      const chunkNumber = Number(await this.BucketActor.getFileTotalIndex(fileKey))
      for (let i = 0; i < chunkNumber; i++) {
        queryPromiseArr.push(this.BucketActor.get(fileKey, BigInt(i)))
      }
      const res = (await Promise.all(queryPromiseArr)) as Array<getRes>
      if (res[0][0]) {
        const fileType = res[0][0][1]
        res.forEach(e => {
          if (e[0]) {
            dataArr.push(e[0][0])
            fileSize += e[0][0].length
          }
        })
        const metadata = await this.getFile(dataArr, fileSize)
        if (fileType === "text/plain") return new TextDecoder().decode(metadata)
        return new Blob([metadata.buffer], {
          type: fileType,
        })
      } else {
        throw new Error("have no data")
      }
    } catch (e) {
      throw e
    }
  }
}
