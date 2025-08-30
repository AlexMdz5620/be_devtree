const dynamicOrigins = process.env.FRONT_URL ? [process.env.FRONT_URL] : [];

export const allowedOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    ...dynamicOrigins
];
