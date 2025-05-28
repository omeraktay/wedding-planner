import {expressjwt} from 'express-jwt';
import jwks from 'jwks-rsa';
import dotenv from 'dotenv';
// import { expressJwtSecret } from 'jwks-rsa';

dotenv.config();

export const checkJwt = expressjwt({
    secret: jwks.expressJwtSecret({
        cahce: true,
        rateLimit: true,
        jwksRequesPerMinute: 5,
        jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
    }),
    audience: process.env.AUTH0_AUDIENCE,
    issuer: `https://${process.env.AUTH0_DOMAIN}/`,
    algorithms: ['RS256']
})