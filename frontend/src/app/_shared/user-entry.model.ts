export interface UserEntry {
    id: number,
    name: string | null,
    email: string,
    username: string,
    picture: string,
    bio: string,
    notifications: boolean,
    isOwner: boolean,
    isCritic: boolean,
    status: string,
    direction: string,
    permissions: string,
    updated: Date,
    created: Date
}
