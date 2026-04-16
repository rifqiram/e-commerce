import postgres from 'postgres';
import fs from 'fs';
import path from 'path';

async function testConnection(url) {
  const sql = postgres(url, {
    ssl: 'require',
    connect_timeout: 5,
    max: 1
  });
  try {
    const [{ count }] = await sql`SELECT 1 as count`;
    console.log(`SUCCESS: ${url}`);
    return sql;
  } catch (err) {
    console.log(`FAILED: ${url} - ${err.code}`);
    return null;
  }
}

async function findWorkingConnection() {
  const password = '23November2001.';
  const id = 'hcazotevjwwvdfbrgwoi';
  
  const urls = [
    // Standard pooler in likely regions
    `postgresql://postgres.${id}:${password}@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres`,
    `postgresql://postgres.${id}:${password}@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres`,
    `postgresql://postgres.${id}:${password}@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres`,
    // Direct with 6543
    `postgresql://postgres:${password}@db.${id}.supabase.co:6543/postgres`,
    // Original (which timeout)
    `postgresql://postgres:${password}@db.${id}.supabase.co:5432/postgres`
  ];
  
  let workingSql = null;
  let workingUrl = '';
  
  for (const url of urls) {
    workingSql = await testConnection(url);
    if (workingSql) {
      workingUrl = url;
      break;
    }
  }

  if (workingSql) {
    console.log('Found working connection string! Proceeding with Schema initialization and seeding...');
    
    try {
      // Create Schema
      const schemaPath = path.join(process.cwd(), 'database', 'schema.sql');
      if (fs.existsSync(schemaPath)) {
        console.log('Running schema.sql...');
        const schema = fs.readFileSync(schemaPath, 'utf-8');
        await workingSql.unsafe(schema);
        console.log('Schema created successfully.');
      } else {
         console.warn('database/schema.sql not found!!!');
      }

      // Seed
      const adminEmail = 'admin@aurastore.com';
      const existing = await workingSql`SELECT id FROM users WHERE email = ${adminEmail}`;
      if (existing.length === 0) {
        // We'll write a simple unhashed password for now just to populate, wait better to use bcrypt
        console.log('Admin user should be registered via UI or bcrypt here. We will just insert products.');
      }
      
      const currentProducts = await workingSql`SELECT count(*) FROM products`;
      if (parseInt(currentProducts[0].count) === 0) {
        console.log('Inserting mock products...');
        await workingSql`
          INSERT INTO products (name, description, price, stock, image_url) VALUES 
          ('Premium Wireless Headphones', 'Experience unparalleled sound quality with active noise cancellation.', 299.99, 45, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'),
          ('Minimalist Smartwatch', 'Track your fitness and stay connected with this sleek timepiece.', 199.50, 20, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80')
        `;
        console.log('Mock products inserted successfully.');
      }

      // Overwrite .env.local with working URL
      const envPath = path.resolve(process.cwd(), '.env.local');
      if (fs.existsSync(envPath)) {
        let envConfig = fs.readFileSync(envPath, 'utf-8');
        envConfig = envConfig.replace(/^DATABASE_URL=.*$/m, `DATABASE_URL=${workingUrl}`);
        fs.writeFileSync(envPath, envConfig);
        console.log('Updated .env.local with working URL');
      }

    } catch (err) {
      console.error('Error during execution:', err);
    } finally {
      process.exit(0);
    }
  } else {
    console.error('ALL connection options failed.');
    process.exit(1);
  }
}

findWorkingConnection();
