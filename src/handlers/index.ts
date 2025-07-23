import { Request, Response } from 'express';
import slug from 'slug';
import formidable from 'formidable';
import { v4 as uuid } from 'uuid';
import User from "../models/User";
import { checkPass, hashPass } from '../utils/auth';
import { generateJWT } from '../utils/jwt';
import cloudinary from '../config/cloudinary';

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

export const getUser = async (req: Request, res: Response) => {
    res.json(req.user);
}

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.user?._id)

        const { description } = req.body;
        const handle = slug(req.body.handle, '');

        const handleExist = await User.findOne({ handle });
        if (handleExist && handleExist.email !== user?.email) {
            const error = new Error('Nombre de usuario no disponible');
            res.status(409).json({ error: error.message });
            return;
        }

        user!.description = description;
        user!.handle = handle;
        await user!.save();

        res.send('Perfil actualizado correctamente');

    } catch (e) {
        console.log(e);
        const error = new Error('Huvo un error');
        res.status(500).json({ error: error.message });
        return;
    }
}

export const uploadImage = async (req: Request, res: Response) => {
    const form = formidable({ multiples: false });

    try {
        form.parse(req, (err, fields, files) => {
            if (files.file && Array.isArray(files.file) && files.file[0]) {
                cloudinary.uploader.upload(files.file[0].filepath, { public_id: uuid() }, async function (err, result) {
                    if (err) {
                        const error = new Error('Huvo un error al subir la imagen');
                        res.status(500).json({ error: error.message });
                        return;
                    };
                    if (result) {
                        if (req.user) {
                            req.user.image = result.secure_url;
                            await req.user.save()
                            res.json({ image: result.secure_url });
                        }
                    };
                });
            } else {
                console.log('No file uploaded.');
            }
        });
    } catch (e) {
        const error = new Error('Huvo un error');
        res.status(500).json({ error: error.message });
        return;
    }
}
