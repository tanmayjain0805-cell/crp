import * as jwt from 'jsonwebtoken'

const SECRET: string = process.env.JWT_SECRET || 'crp_default_secret'

export interface JWTPayload {
  userId: string
  email:  string
  role:   string
  name:   string
}

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, SECRET, { expiresIn: '7d' } as jwt.SignOptions)
}

export function verifyToken(token: string): JWTPayload {
  return jwt.verify(token, SECRET) as JWTPayload
}
