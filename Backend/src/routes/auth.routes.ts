import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import  jwt from 'jsonwebtoken';
import pool from '../db/pool';

const router = Router();

//POST /api/auth/register
router.post('/register', async(req: Request, res: Response): Promise<void> =>{
    const {username, email, password, role } = req.body;

    if(!username || !email || !password) {
        res.status(400).json({ error: 'Vul alle velden in'});
        return;
    }

    const allowdRoles = ['student', 'teacher'];
    const userRole = allowdRoles.includes(role) ? role : 'student';

    try {
        const password_hash = await bcrypt.hash(password, 10);

        const result = await pool.query(
            `INSERT INTO users (username, email, password_hash, role)
            VALUES ($1, $2, $3, $4)
            RETURNING id, username, email, role, created_at`,
            [username, email, password_hash, userRole]
        );

        res.status(201).json({ user: result.rows[0] });
    } catch (err: any ) {
        if (err.code === '23505'){
            res.status(409).json({ error: 'Gebruikersnaam of e-mail bestaat al'});
        }else{
            console.error(err);
            res.status(500).json({ error: 'Registratie mislukt'});
        }
    }

});

//Post /api/auth/login
router.post('login', async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    if(!email || !password) {
        res.status(400).json({error: 'Vul e-mail en wachtwoord in'});
        return;
    }

    try{
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1', 
            [email]
        );

        const user = result.rows[0];

        if (!user) {
            res.status(401).json({error: 'Onjuist e-mai'});
            return;
        }

        const passwordMatch = await bcrypt.compare(password, user.password_hash);

        if(!passwordMatch) {
            res.status(401).json({error: 'Onjuist Wachtwoord'});
            return;
        }

        const token = jwt.sign(
            { id:user.id, role:user.role },
            process.env.JWT_SECRET as string,
            { expiresIn: '7d' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
        });
    }catch(err){
        console.error(err);
        res.status(500).json({ error: 'Inloggen is mislukt'});
    }
});

export default router;