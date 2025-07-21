import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import router from './router';
import { connectDB } from './config/db';
import { corsConfig } from './config/cors';

const app = express();

connectDB();

// CORS
app.use(cors(corsConfig));

app.use(express.json());

// Routing
app.use('/', router);

// console.log("🔍 Rutas registradas:");
// router.stack.forEach((layer: any) => { // Usa `any` temporalmente
//   if (layer.route?.methods) { // Verifica explícitamente `methods`
//     console.log(
//       `${Object.keys(layer.route.methods).join(', ').toUpperCase()} -> ${layer.route.path}`
//     );
//   }
// });


export default app;