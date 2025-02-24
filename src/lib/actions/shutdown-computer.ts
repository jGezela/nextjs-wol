"use server"

import { exec, ExecException } from "child_process";

interface shutdownComputerState {
  message: string;
  details: string;
}

export default async function shutdownComputer(ip: string): Promise<shutdownComputerState> {
  const shutdownCommand = `shutdown /s /t 0 /m \\\\${ip}`;

  return new Promise( resolve => {
    exec(shutdownCommand, (error: ExecException | null) => {
      if(error) {
        resolve({
          message: "shutdown-error",
          details: "There was a shutdown error.",
        });
      }

      resolve({
        message: "success",
        details: "Computer is shuting down.",
      });
    })
  });
}