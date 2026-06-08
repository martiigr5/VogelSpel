-- ============================================================
-- Schema: NT2 Vogelspel
-- Database: PostgreSQL
-- ============================================================

-- Extensie voor UUID (optioneel, serial is ook prima voor dit project)
-- CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- Opruimen (handig tijdens development)
-- ============================================================
DROP TABLE IF EXISTS collected_items CASCADE;
DROP TABLE IF EXISTS progress CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS assignment_options CASCADE;
DROP TABLE IF EXISTS assignments CASCADE;
DROP TABLE IF EXISTS inventory_items CASCADE;
DROP TABLE IF EXISTS levels CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================================
-- TABEL: users
-- Bevat zowel leerlingen als docenten (onderscheid via role)
-- ============================================================
CREATE TABLE users (
    id               SERIAL PRIMARY KEY,
    username         VARCHAR(50)  NOT NULL UNIQUE,
    email            VARCHAR(100) NOT NULL UNIQUE,
    password_hash    VARCHAR(255) NOT NULL,
    role             VARCHAR(10)  NOT NULL DEFAULT 'student'
                         CHECK (role IN ('student', 'teacher')),
    created_at       TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABEL: levels
-- De 4 niveaus van het spel (klank, woord, zin, schrijven)
-- ============================================================
CREATE TABLE levels (
    id               SERIAL PRIMARY KEY,
    level_number     INT          NOT NULL UNIQUE CHECK (level_number >= 1),
    title            VARCHAR(100) NOT NULL,
    type             VARCHAR(20)  NOT NULL
                         CHECK (type IN ('sound', 'word', 'sentence', 'write')),
    description      TEXT,
    scene_image      VARCHAR(255),        -- achtergrondafbeelding van de scène
    is_active        BOOLEAN      NOT NULL DEFAULT TRUE
);

-- ============================================================
-- TABEL: inventory_items
-- Objecten die de speler kan vinden in een level (FR5)
-- ============================================================
CREATE TABLE inventory_items (
    id               SERIAL PRIMARY KEY,
    level_id         INT          NOT NULL REFERENCES levels(id) ON DELETE CASCADE,
    name             VARCHAR(100) NOT NULL,
    image_file       VARCHAR(255),
    audio_file       VARCHAR(255),
    hint_text        TEXT,
    position_x       INT,                 -- klikpositie op de scène (pixels)
    position_y       INT
);

-- ============================================================
-- TABEL: assignments
-- Taalopdrachten binnen een level (FR6 t/m FR9)
-- question_type bepaalt welk soort opdracht het is
-- ============================================================
CREATE TABLE assignments (
    id               SERIAL PRIMARY KEY,
    level_id         INT          NOT NULL REFERENCES levels(id) ON DELETE CASCADE,
    question_type    VARCHAR(20)  NOT NULL
                         CHECK (question_type IN (
                             'sound_click',       -- niveau 1: klik het juiste object bij een klank
                             'word_click',        -- niveau 2: klik het object bij een woord
                             'sentence_order',    -- niveau 3: sorteer de zin
                             'sentence_fill',     -- niveau 3: vul de zin aan
                             'write'              -- niveau 4: schrijf een zin
                         )),
    prompt_text      TEXT         NOT NULL,        -- de opdrachttekst
    audio_file       VARCHAR(255),                 -- voice-over van de opdracht (FR12)
    word_bank        TEXT[],                       -- woordenbank voor schrijfopdrachten (FR9)
    order_index      INT          NOT NULL DEFAULT 0
);

-- ============================================================
-- TABEL: assignment_options
-- Antwoordopties voor klik- en sorteeropdrachten (FR6, FR7, FR8)
-- ============================================================
CREATE TABLE assignment_options (
    id               SERIAL PRIMARY KEY,
    assignment_id    INT          NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
    option_text      VARCHAR(255) NOT NULL,
    audio_file       VARCHAR(255),
    image_file       VARCHAR(255),
    is_correct       BOOLEAN      NOT NULL DEFAULT FALSE,
    order_index      INT          NOT NULL DEFAULT 0  -- voor sorteeropdrachten
);

-- ============================================================
-- TABEL: sessions
-- Savegame per leerling per level (FR14)
-- ============================================================
CREATE TABLE sessions (
    id               SERIAL PRIMARY KEY,
    user_id          INT          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    level_id         INT          NOT NULL REFERENCES levels(id) ON DELETE CASCADE,
    started_at       TIMESTAMP    NOT NULL DEFAULT NOW(),
    last_active      TIMESTAMP    NOT NULL DEFAULT NOW(),
    completed        BOOLEAN      NOT NULL DEFAULT FALSE,
    completed_at     TIMESTAMP,
    UNIQUE (user_id, level_id)   -- één sessie per leerling per level
);

-- ============================================================
-- TABEL: progress
-- Antwoorden per opdracht per sessie (ER3)
-- Basis voor het docentendashboard
-- ============================================================
CREATE TABLE progress (
    id               SERIAL PRIMARY KEY,
    session_id       INT          NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    assignment_id    INT          NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
    is_correct       BOOLEAN      NOT NULL,
    attempts         INT          NOT NULL DEFAULT 1,
    student_answer   TEXT,                         -- vrij tekstveld voor schrijfopdrachten
    answered_at      TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABEL: collected_items
-- Welke inventarisitems heeft de speler gevonden (FR5)
-- ============================================================
CREATE TABLE collected_items (
    id               SERIAL PRIMARY KEY,
    session_id       INT          NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    item_id          INT          NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,
    collected_at     TIMESTAMP    NOT NULL DEFAULT NOW(),
    UNIQUE (session_id, item_id) -- elk item maar één keer verzamelen
);

-- ============================================================
-- INDEXEN
-- Snellere queries voor dashboard en savegame-ophalen
-- ============================================================
CREATE INDEX idx_sessions_user        ON sessions(user_id);
CREATE INDEX idx_sessions_level       ON sessions(level_id);
CREATE INDEX idx_progress_session     ON progress(session_id);
CREATE INDEX idx_progress_assignment  ON progress(assignment_id);
CREATE INDEX idx_collected_session    ON collected_items(session_id);
CREATE INDEX idx_assignments_level    ON assignments(level_id);
CREATE INDEX idx_options_assignment   ON assignment_options(assignment_id);

-- ============================================================
-- SEED DATA: levels
-- ============================================================
INSERT INTO levels (level_number, title, type, description) VALUES
    (1, 'De klanken van de vogel',   'sound',    'Herken klanken en klik het juiste object'),
    (2, 'Woorden zoeken',            'word',     'Vind het object dat bij het woord past'),
    (3, 'Zinnen bouwen',             'sentence', 'Sorteer en vul zinnen in'),
    (4, 'Schrijf het zelf',          'write',    'Schrijf korte zinnen met een woordenbank');

-- ============================================================
-- SEED DATA: voorbeeld-opdrachten niveau 1 (klankherkenning)
-- ============================================================
INSERT INTO assignments (level_id, question_type, prompt_text, audio_file, order_index) VALUES
    (1, 'sound_click', 'Klik op het plaatje met de klank "oe"',  'audio/klank_oe.mp3',  1),
    (1, 'sound_click', 'Klik op het plaatje met de klank "aa"',  'audio/klank_aa.mp3',  2),
    (1, 'sound_click', 'Klik op het plaatje met de klank "ui"',  'audio/klank_ui.mp3',  3);

-- Opties voor opdracht 1 (klank "oe") — meerdere kunnen goed zijn (FR6)
INSERT INTO assignment_options (assignment_id, option_text, image_file, is_correct) VALUES
    (1, 'boek',   'images/boek.png',   TRUE),
    (1, 'hoed',   'images/hoed.png',   TRUE),
    (1, 'boom',   'images/boom.png',   FALSE),
    (1, 'fiets',  'images/fiets.png',  FALSE);

-- ============================================================
-- SEED DATA: voorbeeld-opdrachten niveau 2 (woordherkenning)
-- ============================================================
INSERT INTO assignments (level_id, question_type, prompt_text, audio_file, order_index) VALUES
    (2, 'word_click', 'Klik op de "appel"',  'audio/woord_appel.mp3',  1),
    (2, 'word_click', 'Klik op de "stoel"',  'audio/woord_stoel.mp3',  2);

INSERT INTO assignment_options (assignment_id, option_text, image_file, is_correct) VALUES
    (4, 'appel',  'images/appel.png',  TRUE),
    (4, 'peer',   'images/peer.png',   FALSE),
    (4, 'banaan', 'images/banaan.png', FALSE),
    (5, 'stoel',  'images/stoel.png',  TRUE),
    (5, 'tafel',  'images/tafel.png',  FALSE),
    (5, 'bank',   'images/bank.png',   FALSE);

-- ============================================================
-- SEED DATA: voorbeeld-opdracht niveau 3 (zinsbouw)
-- ============================================================
INSERT INTO assignments (level_id, question_type, prompt_text, audio_file, order_index) VALUES
    (3, 'sentence_order', 'Zet de woorden in de juiste volgorde',  'audio/zin_order_1.mp3', 1),
    (3, 'sentence_fill',  'Vul het ontbrekende woord in',          'audio/zin_fill_1.mp3',  2);

INSERT INTO assignment_options (assignment_id, option_text, is_correct, order_index) VALUES
    (6, 'De',     TRUE, 1),
    (6, 'vogel',  TRUE, 2),
    (6, 'vliegt', TRUE, 3),
    (6, 'hoog',   TRUE, 4),
    (7, 'vliegt', TRUE, 0);

-- ============================================================
-- SEED DATA: voorbeeld-opdracht niveau 4 (schrijven)
-- ============================================================
INSERT INTO assignments (level_id, question_type, prompt_text, audio_file, word_bank, order_index) VALUES
    (4, 'write',
     'Schrijf een zin over de vogel. Gebruik de woorden hieronder.',
     'audio/schrijf_1.mp3',
     ARRAY['de', 'vogel', 'vliegt', 'hoog', 'boom', 'zit', 'op', 'een'],
     1);
