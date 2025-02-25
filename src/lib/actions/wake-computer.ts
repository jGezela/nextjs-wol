"use server"

import ping from "ping";
import wol from "wake_on_lan";

interface wakeComputerState {
  message: string;
  details: string;
}

export default async function wakeComputer(ip: string, mac: string): Promise<wakeComputerState> {
  return new Promise( resolve => {
    wol.wake(mac, (error: unknown) => {
      if(error) {
        resolve({
          message: "wol-error",
          details: "There was a wake up error."
        });
      } 
      
      setTimeout(async () => {
        const res = await ping.promise.probe(ip);
        if(res.alive) {
          resolve({
            message: "success",
            details: "Computer is waking up.",
          });
        } else {
          resolve({
            message: "ping-error",
            details: "Wake-on-LAN signal sent, but computer is not responding."
          });
        }
      }, 30000);
    });
  });
}