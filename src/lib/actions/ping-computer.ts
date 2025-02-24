"use server"

import ping, { PingResponse } from "ping";

export default async function pingComputer(ip: string): Promise<PingResponse> {
  const res = await ping.promise.probe(ip);
  return res;
} 