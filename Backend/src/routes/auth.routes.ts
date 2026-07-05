import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import  jwt from 'jsonwebtoken';
import pool from '../db/pool';

const router = Router();

//POST /api/auth/register.
// Maakt nieuw account aan.
router.post('/register', async(req: Request, res: Response): Promise<void> =>{
    const { voornaam, achternaam, klas, email, password, role } = req.body;
    
    // checkt of de velden gevuld zijn
    if(!voornaam || !achternaam || !email || !password) {
        res.status(400).json({ error: 'Vul alle velden in'});
        return;
    }

    // zetten twee rollen en kan niet role 'Admin' krijgen. 
    // is er geen role ingevult, automatisch 'student'.
    const allowedRoles = ['student', 'teacher'];
    const userRole = allowedRoles.includes(role) ? role : 'student';

    try {
        // hash het password met Bcrypt, 10 salt rounds.
        const password_hash = await bcrypt.hash(password, 10);

        // voegt de ingevulde gegevens toe aan database.
        // hash_password komt niet in RTURNING om niet per ongeluk het te sturen naar de client.
        const result = await pool.query(
            `INSERT INTO users (voornaam, achternaam, klas, email, password_hash, role)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id, voornaam, achternaam, klas, email, role, created_at`,
            [voornaam, achternaam, klas, email, password_hash, userRole]
        );

        res.status(201).json({ user: result.rows[0] });
    } catch (err: any) {
        if (err.code === '23505'){
            res.status(409).json({ error: 'E-mail bestaat al'});
        } else {
            console.error(err);
            res.status(500).json({ error: 'Registratie mislukt'});
        }
    }
});

// Post /api/auth/login
// 
router.post('/login', async (req: Request, res: Response): Promise<void> => {
    console.log('Login route bereikt:', req.body)
    const { email, password } = req.body;

    // controlleerd of velden ingevuld zijn.
    if(!email || !password) {
        res.status(400).json({error: 'Vul e-mail en wachtwoord in'});
        return;
    }

    try{
        // zoekt in database naar gelijk e-mail.
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1', 
            [email]
        );

        const user = result.rows[0];

        // als e-mail niet overeen komt, geen bestaand account.
        if (!user) {
            res.status(401).json({error: 'Onjuist e-mai'});
            return;
        }

        // voert een check uit om de ingevoerde passwordt te vergelijken met de gebruikers password.
        const passwordMatch = await bcrypt.compare(password, user.password_hash);

        // als password niet overeenkomt, onjuist wachtwoord.
        if(!passwordMatch) {
            res.status(401).json({error: 'Onjuist Wachtwoord'});
            return;
        }

        // maakt een token om de gebruiker 7 dagen ingelogt te blijven.
        const token = jwt.sign(
            { id:user.id, role:user.role },
            process.env.JWT_SECRET as string,
            { expiresIn: '7d' }
        );

        res.json({
        token,
        user: {
        id:         user.id,
        voornaam:   user.voornaam,
        achternaam: user.achternaam,
        klas:       user.klas,
        email:      user.email,
        role:       user.role,
    },
});
    }catch(err){
        console.error(err);
        res.status(500).json({ error: 'Inloggen is mislukt'});
    }
});

export default router;