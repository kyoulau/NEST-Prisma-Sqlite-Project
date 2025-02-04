import { Injectable } from "@nestjs/common";
import { HashingServiceProtocol } from "./bcrypt.service";
import * as bcrypt from 'bcrypt'

export class BCryptHashService extends HashingServiceProtocol{
  async hashing(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password,salt)
  }
  async compare(password: string, passwordHash: string): Promise<boolean> {
    return bcrypt.compare(password, passwordHash)
  }
}