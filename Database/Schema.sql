-- ============================================================
-- Schema: NT2 Vogelspel
-- Database: PostgreSQL 18
-- ============================================================

-- Opruimen (handig tijdens development)
DROP TABLE IF EXISTS collected_items CASCADE;
DROP TABLE IF EXISTS progress CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS assignment_options CASCADE;
DROP TABLE IF EXISTS assignments CASCADE;
DROP TABLE IF EXISTS inventory_items CASCADE;
DROP TABLE IF EXISTS levels CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS klassen CASCADE;

-- ============================================================
-- TABEL: klassen
-- ============================================================
CREATE TABLE klassen (
    id          SERIAL PRIMARY KEY,
    naam        VARCHAR(20) NOT NULL UNIQUE,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABEL: users
-- ============================================================
CREATE TABLE users (
    id               SERIAL PRIMARY KEY,
    email            VARCHAR(100) NOT NULL UNIQUE,
    password_hash    VARCHAR(255) NOT NULL,
    role             VARCHAR(10)  NOT NULL DEFAULT 'student'
                         CHECK (role IN ('student', 'teacher')),
    voornaam         VARCHAR(50),
    achternaam       VARCHAR(50),
    klas             VARCHAR(20),
    klas_id          INT REFERENCES klassen(id),
    created_at       TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABEL: levels
-- ============================================================
CREATE TABLE levels (
    id               SERIAL PRIMARY KEY,
    level_number     INT          NOT NULL UNIQUE CHECK (level_number >= 1),
    title            VARCHAR(100) NOT NULL,
    type             VARCHAR(20)  NOT NULL
                         CHECK (type IN ('sound', 'word', 'sentence', 'write')),
    description      TEXT,
    scene_image      VARCHAR(255),
    is_active        BOOLEAN      NOT NULL DEFAULT TRUE
);

-- ============================================================
-- TABEL: inventory_items
-- ============================================================
CREATE TABLE inventory_items (
    id               SERIAL PRIMARY KEY,
    level_id         INT          NOT NULL REFERENCES levels(id) ON DELETE CASCADE,
    name             VARCHAR(100) NOT NULL,
    image_file       VARCHAR(255),
    audio_file       VARCHAR(255),
    hint_text        TEXT,
    position_x       INT,
    position_y       INT,
    klank            VARCHAR(10),
    width            INT DEFAULT 80,
    height           INT DEFAULT 80
);

-- ============================================================
-- TABEL: assignments
-- ============================================================
CREATE TABLE assignments (
    id               SERIAL PRIMARY KEY,
    level_id         INT          NOT NULL REFERENCES levels(id) ON DELETE CASCADE,
    question_type    VARCHAR(20)  NOT NULL
                         CHECK (question_type IN (
                             'sound_click',
                             'word_click',
                             'sentence_order',
                             'sentence_fill',
                             'write'
                         )),
    prompt_text      TEXT         NOT NULL,
    audio_file       VARCHAR(255),
    word_bank        TEXT[],
    order_index      INT          NOT NULL DEFAULT 0
);

-- ============================================================
-- TABEL: assignment_options
-- ============================================================
CREATE TABLE assignment_options (
    id               SERIAL PRIMARY KEY,
    assignment_id    INT          NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
    option_text      VARCHAR(255) NOT NULL,
    audio_file       VARCHAR(255),
    image_file       VARCHAR(255),
    is_correct       BOOLEAN      NOT NULL DEFAULT FALSE,
    order_index      INT          NOT NULL DEFAULT 0
);

-- ============================================================
-- TABEL: sessions
-- ============================================================
CREATE TABLE sessions (
    id               SERIAL PRIMARY KEY,
    user_id          INT          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    level_id         INT          NOT NULL REFERENCES levels(id) ON DELETE CASCADE,
    started_at       TIMESTAMP    NOT NULL DEFAULT NOW(),
    last_active      TIMESTAMP    NOT NULL DEFAULT NOW(),
    completed        BOOLEAN      NOT NULL DEFAULT FALSE,
    completed_at     TIMESTAMP
);

-- ============================================================
-- TABEL: progress
-- Geen FK op assignment_id omdat niveau 1 inventory_items gebruikt
-- ============================================================
CREATE TABLE progress (
    id               SERIAL PRIMARY KEY,
    session_id       INT          NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    assignment_id    INT          NOT NULL,
    is_correct       BOOLEAN      NOT NULL,
    attempts         INT          NOT NULL DEFAULT 1,
    student_answer   TEXT,
    answered_at      TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABEL: collected_items
-- ============================================================
CREATE TABLE collected_items (
    id               SERIAL PRIMARY KEY,
    session_id       INT          NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    item_id          INT          NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,
    collected_at     TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- ============================================================
-- INDEXEN
-- ============================================================
CREATE INDEX idx_sessions_user        ON sessions(user_id);
CREATE INDEX idx_sessions_level       ON sessions(level_id);
CREATE INDEX idx_progress_session     ON progress(session_id);
CREATE INDEX idx_collected_session    ON collected_items(session_id);
CREATE INDEX idx_assignments_level    ON assignments(level_id);
CREATE INDEX idx_options_assignment   ON assignment_options(assignment_id);

-- ============================================================
-- SEED DATA: klassen
-- ============================================================
INSERT INTO klassen (naam) VALUES ('A3'), ('D4');

-- ============================================================
-- SEED DATA: levels
-- ============================================================
INSERT INTO levels (level_number, title, type, description, scene_image) VALUES
    (1, 'De klanken van de vogel', 'sound',    'Herken klanken en klik het juiste object', 'scenes/scene-level1.png'),
    (2, 'Woorden zoeken',          'word',     'Vind het object dat bij het woord past',   NULL),
    (3, 'Zinnen bouwen',           'sentence', 'Sorteer en vul zinnen in',                 NULL),
    (4, 'Schrijf het zelf',        'write',    'Schrijf korte zinnen met een woordenbank', NULL);

-- ============================================================
-- SEED DATA: inventory_items niveau 1
-- ============================================================
INSERT INTO inventory_items (level_id, name, image_file, position_x, position_y, width, height, klank) VALUES
    (1, 'paard',  'items/paard.png',  30,  300, 100, 90,  'aa'),
    (1, 'taart',  'items/taart.png',  60,  400, 90,  80,  'aa'),
    (1, 'kaars',  'items/kaars.png',  780, 350, 70,  100, 'aa'),
    (1, 'aap',    'items/aap.png',    700, 260, 85,  90,  'aa'),
    (1, 'boek',   'items/boek.png',   450, 410, 80,  70,  'oe'),
    (1, 'hoed',   'items/hoed.png',   350, 60,  90,  75,  'oe'),
    (1, 'bloem',  'items/bloem.png',  580, 370, 85,  85,  'oe'),
    (1, 'stoel',  'items/stoel.png',  350, 400, 95,  90,  'oe'),
    (1, 'fiets',  'items/fiets.png',  200, 350, 110, 80,  'ie'),
    (1, 'riem',   'items/riem.png',   65,  120, 80,  60,  'ie'),
    (1, 'vlieg',  'items/vlieg.png',  700, 120, 75,  70,  'ie'),
    (1, 'brief',  'items/brief.png',  200, 175, 85,  75,  'ie');

-- ============================================================
-- SEED DATA: voorbeeld opdrachten niveau 2
-- ============================================================
INSERT INTO assignments (level_id, question_type, prompt_text, order_index) VALUES
    (2, 'word_click', 'Klik op de "appel"',  1),
    (2, 'word_click', 'Klik op de "stoel"',  2);

INSERT INTO assignment_options (assignment_id, option_text, image_file, is_correct) VALUES
    (1, 'appel',  'images/appel.png',  TRUE),
    (1, 'peer',   'images/peer.png',   FALSE),
    (1, 'banaan', 'images/banaan.png', FALSE),
    (2, 'stoel',  'images/stoel.png',  TRUE),
    (2, 'tafel',  'images/tafel.png',  FALSE),
    (2, 'bank',   'images/bank.png',   FALSE);

-- ============================================================
-- SEED DATA: voorbeeld opdracht niveau 3
-- ============================================================
INSERT INTO assignments (level_id, question_type, prompt_text, order_index) VALUES
    (3, 'sentence_order', 'Zet de woorden in de juiste volgorde', 1),
    (3, 'sentence_fill',  'Vul het ontbrekende woord in',         2);

INSERT INTO assignment_options (assignment_id, option_text, is_correct, order_index) VALUES
    (3, 'De',     TRUE, 1),
    (3, 'vogel',  TRUE, 2),
    (3, 'vliegt', TRUE, 3),
    (3, 'hoog',   TRUE, 4),
    (4, 'vliegt', TRUE, 0);

-- ============================================================
-- SEED DATA: voorbeeld opdracht niveau 4
-- ============================================================
INSERT INTO assignments (level_id, question_type, prompt_text, word_bank, order_index) VALUES
    (4, 'write',
     'Schrijf een zin over de vogel. Gebruik de woorden hieronder.',
     ARRAY['de', 'vogel', 'vliegt', 'hoog', 'boom', 'zit', 'op', 'een'],
     1);