import { Router, Response } from 'express';
import pool from '../db/pool';
import { authenticateToken, requireTeacher, AuthRequest } from '../middleware/auth.middleware';
import { promises } from 'dns';

const router = Router();

// POST /api/progress/session — start of hervat een sessie
router.post('/session', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  const { level_id } = req.body;
  const user_id = req.user!.id;

  try {
    const result = await pool.query(
      `INSERT INTO sessions (user_id, level_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, level_id)
       DO UPDATE SET last_active = NOW()
       RETURNING *`,
      [user_id, level_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Sessie starten mislukt' });
  }
});

// POST /api/progress/answer — antwoord op een opdracht opslaan
router.post('/answer', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  const { session_id, assignment_id, is_correct, student_answer } = req.body;

  try {
    // Kijk of er al een antwoord is (voor attempts bij)
    const existing = await pool.query(
      'SELECT id, attempts FROM progress WHERE session_id = $1 AND assignment_id = $2',
      [session_id, assignment_id]
    );

    if (existing.rows.length > 0) {
      const updated = await pool.query(
        `UPDATE progress
         SET is_correct = $1, attempts = attempts + 1, student_answer = $2, answered_at = NOW()
         WHERE id = $3
         RETURNING *`,
        [is_correct, student_answer, existing.rows[0].id]
      );
      res.json(updated.rows[0]);
    } else {
      const inserted = await pool.query(
        `INSERT INTO progress (session_id, assignment_id, is_correct, student_answer)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [session_id, assignment_id, is_correct, student_answer]
      );
      res.json(inserted.rows[0]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Antwoord opslaan mislukt' });
  }
});

// POST /api/progress/collect — item verzamelen
router.post('/collect', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  const { session_id, item_id } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO collected_items (session_id, item_id)
       VALUES ($1, $2)
       ON CONFLICT DO NOTHING
       RETURNING *`,
      [session_id, item_id]
    );
    res.json(result.rows[0] || { message: 'Item al verzameld' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Item verzamelen mislukt' });
  }
});

// POST /api/progress/complete — level voltooien
router.post('/complete', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  const { session_id } = req.body;

  try {
    const result = await pool.query(
      `UPDATE sessions SET completed = TRUE, completed_at = NOW() WHERE id = $1 RETURNING *`,
      [session_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Voltooien mislukt' });
  }
});

router.delete('/session/:levelId', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  const user_id = req.user!.id;
  const level_id = parseInt(req.params.levelId);

  try {
    await pool.query(
      'DELETE FROM sessions WHERE user_id = $1 AND level_id = $2',
      [user_id, level_id]
    );
    res.json({ message: 'Sessie verwijderd' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Verwijderen mislukt' });
  }
});

// GET /api/progress/me — voortgang van ingelogde leerling
router.get('/me', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  const user_id = req.user!.id;

  try {
    const result = await pool.query(
      `SELECT s.*, l.title AS level_title, l.level_number,
        COUNT(p.id) AS answered,
        SUM(CASE WHEN p.is_correct THEN 1 ELSE 0 END) AS correct
       FROM sessions s
       JOIN levels l ON l.id = s.level_id
       LEFT JOIN progress p ON p.session_id = s.id
       WHERE s.user_id = $1
       GROUP BY s.id, l.title, l.level_number
       ORDER BY l.level_number`,
      [user_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Voortgang ophalen mislukt' });
  }
});

// GET /api/progress/students — alle leerlingen voor het dashboard (alleen docenten)
router.get('/students', authenticateToken, requireTeacher, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await pool.query(
      `SELECT u.id, u.username, u.email,
        l.level_number, l.title AS level_title,
        s.completed, s.last_active,
        COUNT(p.id) AS answered,
        SUM(CASE WHEN p.is_correct THEN 1 ELSE 0 END) AS correct
       FROM users u
       LEFT JOIN sessions s ON s.user_id = u.id
       LEFT JOIN levels l ON l.id = s.level_id
       LEFT JOIN progress p ON p.session_id = s.id
       WHERE u.role = 'student'
       GROUP BY u.id, l.level_number, l.title, s.completed, s.last_active
       ORDER BY u.username, l.level_number`,
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Leerlingen ophalen mislukt' });
  }
});

export default router;