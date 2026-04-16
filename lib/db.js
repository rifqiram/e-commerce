import postgres from 'postgres'

const connectionString = process.env.DATABASE_URL
const sql = postgres(connectionString, {
    ssl: 'require',     // Required by Supabase
    max: 10,            // Limit connections
    idle_timeout: 20,   // Max idle time
    connect_timeout: 10 // Connect timeout
})

export default sql
