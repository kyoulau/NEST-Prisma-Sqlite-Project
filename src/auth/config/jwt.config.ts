import { registerAs } from "@nestjs/config";

export default registerAs('jwt', () => {
  return {
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: '1d' },
    audience: process.env.JWT_AUDIENCE,
    issuer: process.env.JWT_ISSUER,
  }
})