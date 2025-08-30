const dynamicOrigins = process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : [];

export const allowedOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    ...dynamicOrigins
];
