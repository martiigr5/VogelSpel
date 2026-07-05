import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken'

// breidt het standaard Espress.js Request-type uit met een optionele 'user' veld
// (user(?)) omdat er nog niet een user bestaat voordat authenticateToken uitgevoerdt is
export interface AuthRequest extends Request {
    user?: {
        id: number;
        role: string;
    };
}

// middelware die controlleerd of er een geldig JWT-token is meegestuurd
export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction): void {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // is er geen token meegestuurd, ook niet inloggen (return;)
    if(!token) {
        res.status(401).json({ error: 'Geen toegang: token ontbreekt'});
        return;
    }

    // valideert het token met het sleutelwoord en haalt de inhoud op.
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number; role: string };
        req.user = decoded;
        next();
    } catch {
        res.status(403).json({ error: 'Geen toegang: ongeldige token' });
    }
}

// checkt na de authenticateToken voor de routes voor docenten.
export function requireTeacher(req: AuthRequest, res: Response, next: NextFunction): void {
    if (req.user?.role !== 'teacher'){
        res.status(403).json({ error: 'Alleen docenten hebben toegang' });
        return;
    }
    next();
};