export interface ContactEntry {
    id: number,
    
    email: string,
    reporter_id: number,
    reporter: string,

    reason: string,
    subject: string,
    message: string,
    website: string,
    status: string,
    reviewed_by: number,
    reviewed_at: Date,
    created: Date,
}