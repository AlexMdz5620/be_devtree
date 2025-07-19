import { CorsOptions } from 'cors';

export const corsConfig: CorsOptions = {
    origin: function (origin, callback) {
        if (origin === process.env.FRONT_URL) {
            callback(null, true);
        } else {
            callback(new Error('Error de CORS'));
        }
    }
}