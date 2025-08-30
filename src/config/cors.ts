import { CorsOptions } from 'cors';
import { allowedOrigins } from './allowedOrigins';

export const corsConfig: CorsOptions = {
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log('Origen bloqueado por CORS:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    }
}