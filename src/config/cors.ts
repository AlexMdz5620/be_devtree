import { CorsOptions } from 'cors';

export const corsConfig: CorsOptions = {
    origin: function (origin, callback) {
        const withList = [process.env.FRONT_URL]

        if (process.argv[2] === '--api') withList.push(undefined);

        if (withList.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Error de CORS'));
        }
    }
}