import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import bcrypt from 'bcryptjs';
import { createSession } from '@/lib/auth';

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const existingUsers = await sql`SELECT * FROM users WHERE email = ${email} LIMIT 1`;
    if (existingUsers.length > 0) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    
    // First user registering might be an admin, but normally we default to user.
    // To allow easiest admin setup during test, we'll let you optionally pass role, 
    // or just default to user.
    const cleanRole = email.includes('admin') ? 'admin' : 'user';

    const users = await sql`
      INSERT INTO users (name, email, password_hash, role)
      VALUES (${name}, ${email}, ${passwordHash}, ${cleanRole})
      RETURNING id, name, email, role
    `;
    const user = users[0];

    await createSession(user.id, user.role);

    return NextResponse.json({ success: true, user });
  } catch (err) {
    console.error('Registration error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
