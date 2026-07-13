import { Router, Response } from 'express';
import pool from '../db/pool';
import { authenticateToken, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

//Get /api/game/levels - alle actieve levels ophalen
router.get('/levels', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        // is_active filterd uit de inactieve levels die nog in ontwikkeling zijn.
        const result = await pool.query(
            'SELECT * FROM levels WHERE is_active = TRUE ORDER BY level_number'
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Level laden is mislukt'});
    }
});

//GET /api/game/levels/:id - één level met opdrachten en items
// wordt aangeroepen als de leerling een level start.
router.get('/levels/:id', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
    // zet de string om naar een string
    const levelId = parseInt(req.params.id);

    try{
        // haalt het level op
        const levelResult = await pool.query(
            'SELECT * FROM levels WHERE id = $1',
            [levelId]
        );

        if(levelResult.rows.length === 0) {
            res.status(404).json({ error: 'Level niet gevonden'});
            return;
        }
        
        //haalt alle opdrachten van dit level op 
        const assignmentsResult = await pool.query(
            `SELECT a.*, 
                json_agg(
                json_build_object(
                    'id', o.id,
                    'option_text', o.option_text,
                    'audio_file', o.audio_file,
                    'image_file', o.image_file,
                    'is_correct', o.is_correct,
                    'order_index', o.order_index
                ) ORDER BY o.order_index
                ) FILTER (WHERE o.id IS NOT NULL) AS options
            FROM assignments a
            LEFT JOIN assignment_options o ON o.assignment_id = a.id
            WHERE a.level_id = $1
            GROUP BY a.id
            ORDER BY a.order_index`,
            [levelId]
        );

        // haalt alle klikbare objecten op
        const itemsResult = await pool.query(
            'SELECT * FROM inventory_items WHERE level_id = $1',
            [levelId]
        );

        // voeg alle opgehaalde quesries toe als 1  response zodat de frontend niet extra requests hoeft te doen.
        res.json({
            level: levelResult.rows[0],
            assignments: assignmentsResult.rows,
            items: itemsResult.rows,
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Level ophalen is mislukt' })
    }
});

export default router;