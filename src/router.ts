import { Router } from 'express';

const router = Router();

/* Autenticación y Registro */
router.get('/auth/register', (req, res) => {
    console.log('Desde Register');
});

export default router