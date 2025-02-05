import { registerAs } from "@nestjs/config";

export default registerAs('jwt', () => {
  return {
    secret: process.env.JWT_SECRET,
    issuer: process.env.JWT_TOKEN_ISSUER,
    jwtTtl: process.env.JWT_TTK
  }
})