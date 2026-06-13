import { Router, Response } from 'express';
import pool from '../db/pool';
import bcrypt from 'bcryptjs';
import { authenticateToken, requireTeacher, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

// GET /api/leerlingen — alle leerlingen
router.get('/', authenticateToken, requireTeacher, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await pool.query(
      `SELECT u.id, u.voornaam, u.achternaam, u.email, u.klas_id, k.naam AS klas_naam
       FROM users u
       LEFT JOIN klassen k ON k.id = u.klas_id
       WHERE u.role = 'student'
       ORDER BY u.achternaam`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Leerlingen ophalen mislukt' });
  }
});

// POST /api/leerlingen — leerling toevoegen
router.post('/', authenticateToken, requireTeacher, async (req: AuthRequest, res: Response): Promise<void> => {
  const { voornaam, achternaam, email, klas_id, password } = req.body;

  if (!voornaam || !achternaam || !email) {
    res.status(400).json({ error: 'Vul alle velden in' });
    return;
  }

  try {
    const wachtwoord = password || 'Welkom123';
    const password_hash = await bcrypt.hash(wachtwoord, 10);

    const result = await pool.query(
      `INSERT INTO users (voornaam, achternaam, email, password_hash, role, klas_id)
       VALUES ($1, $2, $3, $4, 'student', $5)
       RETURNING id, voornaam, achternaam, email, klas_id`,
      [voornaam, achternaam, email, password_hash, klas_id || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    if (err.code === '23505') {
      res.status(409).json({ error: 'E-mail bestaat al' });
    } else {
      console.error(err);
      res.status(500).json({ error: 'Leerling toevoegen mislukt' });
    }
  }
});

// PUT /api/leerlingen/:id — leerling bewerken
router.put('/:id', authenticateToken, requireTeacher, async (req: AuthRequest, res: Response): Promise<void> => {
  const id = parseInt(req.params.id);
  const { voornaam, achternaam, email, klas_id } = req.body;

  try {
    const result = await pool.query(
      `UPDATE users SET voornaam = $1, achternaam = $2, email = $3, klas_id = $4
       WHERE id = $5 AND role = 'student'
       RETURNING id, voornaam, achternaam, email, klas_id`,
      [voornaam, achternaam, email, klas_id, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Leerling bewerken mislukt' });
  }
});

// DELETE /api/leerlingen/:id — leerling verwijderen
router.delete('/:id', authenticateToken, requireTeacher, async (req: AuthRequest, res: Response): Promise<void> => {
  const id = parseInt(req.params.id);
  try {
    await pool.query('DELETE FROM users WHERE id = $1 AND role = \'student\'', [id]);
    res.json({ message: 'Leerling verwijderd' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Leerling verwijderen mislukt' });
  }
});

export default router;