import { Request, Response } from 'express';
import slug from 'slug';
import User from "../models/User";
import { hashPass } from '../utils/auth';
import { validationResult } from 'express-validator';

export const createAccount = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

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

    res.status(201).send('Usuario creado correctamente.');
}
