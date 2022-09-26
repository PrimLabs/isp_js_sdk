import {Buffer} from "buffer";

export const ArrayToHexString = (byteArray: number[]) => {
  return Array.from(byteArray, function (byte) {
    return ("0" + (byte & 0xff).toString(16)).slice(-2);
  }).join("");
};

export const getUint8ArrayFromHex = (str) => {
  return Uint8Array.from(Buffer.from(str, "hex"));
};
