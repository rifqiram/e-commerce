import sql from './lib/db.js';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

// Load .env.local manually
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf-8');
  envConfig.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      process.env[match[1].trim()] = match[2].trim().replace(/^['"](.*)['"]$/, '$1');
    }
  });
}

async function seed() {
  console.log('Seeding database...');
  
  try {
    // 1. Create Admin
    const adminEmail = 'admin@aurastore.com';
    const adminPassword = 'admin'; // simple password for testing
    
    // check if admin exists
    const existingAdmins = await sql`SELECT id FROM users WHERE email = ${adminEmail}`;
    if (existingAdmins.length === 0) {
      const hash = await bcrypt.hash(adminPassword, 10);
      await sql`
        INSERT INTO users (name, email, password_hash, role)
        VALUES ('Aura Admin', ${adminEmail}, ${hash}, 'admin')
      `;
      console.log('Admin user created: admin@aurastore.com / admin');
    } else {
      console.log('Admin user already exists.');
    }

    // 2. Insert Mock Products if none exist
    const currentProducts = await sql`SELECT count(*) FROM products`;
    if (parseInt(currentProducts[0].count) === 0) {
      console.log('Inserting mock products...');
      await sql`
        INSERT INTO products (name, description, price, stock, image_url) VALUES 
        ('Premium Wireless Headphones', 'Experience unparalleled sound quality with active noise cancellation.', 299.99, 45, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'),
        ('Minimalist Smartwatch', 'Track your fitness and stay connected with this sleek timepiece.', 199.50, 20, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'),
        ('Ergonomic Office Chair', 'Support your posture during long working hours with our premium chair.', 450.00, 15, 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=800&q=80'),
        ('Mechanical Keyboard', 'A tactile and satisfying typing experience for professionals and gamers.', 149.99, 60, 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=80')
      `;
      console.log('Mock products inserted successfully.');
    } else {
      console.log('Products already exist. Skipping product insertion.');
    }

  } catch (e) {
    console.error('Error during seeding:', e);
  } finally {
    process.exit(0);
  }
}

seed();
