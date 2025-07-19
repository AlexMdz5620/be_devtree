import { Request, Response } from 'express';
import slug from 'slug';
import User from "../models/User";
import { checkPass, hashPass } from '../utils/auth';
import { generateJWT } from '../utils/jwt';

export const createAccount = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const userExist = await User.findOne({ email });
    if (userExist) {
        const error = new Error('Usuario con ese email ya está registrado');
        res.status(409).json({ error: error.message });
        return;
    }

    const handle = slug(req.body.handle, '');

    const handleExist = await User.findOne({ handle });
    if (handleExist) {
        const error = new Error('Nombre de usuario no disponible');
        res.status(409).json({ error: error.message });
        return;
    }

    const user = new User(req.body);
    user.password = await hashPass(password);
    user.handle = handle;

    await user.save();

    res.status(201).send('Registro exitoso.');
}

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // Usuario registrado
    const user = await User.findOne({ email });
    if (!user) {
        const error = new Error('El usuario no existe');
        res.status(404).json({ error: error.message });
        return;
    }
    // Comprobar password
    const isPassCorrect = await checkPass(password, user.password);
    if (!isPassCorrect) {
        const error = new Error('Password incorrecto');
        res.status(401).json({ error: error.message });
        return;
    }

    const token = generateJWT({ id: user.id });

    res.send(token);
}
