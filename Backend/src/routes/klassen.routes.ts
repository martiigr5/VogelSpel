import { Router, Response } from 'express';
import pool from '../db/pool';
import { authenticateToken, requireTeacher, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

// GET /api/klassen — alle klassen ophalen
router.get('/', authenticateToken, requireTeacher, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await pool.query(
      `SELECT k.*, COUNT(u.id) AS aantal_leerlingen
       FROM klassen k
       LEFT JOIN users u ON u.klas_id = k.id AND u.role = 'student'
       GROUP BY k.id
       ORDER BY k.naam`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Klassen ophalen mislukt' });
  }
});

// POST /api/klassen — nieuwe klas aanmaken
router.post('/', authenticateToken, requireTeacher, async (req: AuthRequest, res: Response): Promise<void> => {
  const { naam } = req.body;
  if (!naam) {
    res.status(400).json({ error: 'Naam is verplicht' });
    return;
  }
  try {
    const result = await pool.query(
      'INSERT INTO klassen (naam) VALUES ($1) RETURNING *',
      [naam]
    );
    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    if (err.code === '23505') {
      res.status(409).json({ error: 'Klas bestaat al' });
    } else {
      console.error(err);
      res.status(500).json({ error: 'Klas aanmaken mislukt' });
    }
  }
});

// DELETE /api/klassen/:id — klas verwijderen
router.delete('/:id', authenticateToken, requireTeacher, async (req: AuthRequest, res: Response): Promise<void> => {
  const id = parseInt(req.params.id);
  try {
    await pool.query('DELETE FROM klassen WHERE id = $1', [id]);
    res.json({ message: 'Klas verwijderd' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Klas verwijderen mislukt' });
  }
});

// GET /api/klassen/:id/leerlingen — leerlingen van een klas
router.get('/:id/leerlingen', authenticateToken, requireTeacher, async (req: AuthRequest, res: Response): Promise<void> => {
  const id = parseInt(req.params.id);
  try {
    const result = await pool.query(
      `SELECT id, voornaam, achternaam, email, klas_id
       FROM users WHERE klas_id = $1 AND role = 'student'
       ORDER BY achternaam`,
      [id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Leerlingen ophalen mislukt' });
  }
});

export default router;