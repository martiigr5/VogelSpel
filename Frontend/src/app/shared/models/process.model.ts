export interface Session {
    id: number;
    user_id: number;
    level_id: number;
    started_at: string;
    last_active: string;
    completed: boolean;
    completed_at: string | null;
    level_title: string;
    level_number: number;
    answered: number;
    correct: number;
}

export interface AnswerRequest {
    session_id: number;
    assignment_id: number;
    is_correct: boolean;
    student_answer: string;
}

export interface StudentProgress {
    id: number;
    voornaam: string;
    achternaam: string;
    email: string;
    klas_naam: string;
    level_number: number;
    completed: boolean;
    last_active: string;
    answered: number;
    correct: number;
}