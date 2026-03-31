require('dotenv').config()
const { Pool } = require('pg')

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_VGpZrwP70vJk@ep-shy-lab-amyh5564-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
  ssl: { rejectUnauthorized: false }
})

async function migrate() {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    await client.query(`
      CREATE TABLE IF NOT EXISTS clientes (
        id          SERIAL PRIMARY KEY,
        nombre      VARCHAR(100) NOT NULL,
        apellido    VARCHAR(100),
        email       VARCHAR(150) UNIQUE NOT NULL,
        password    VARCHAR(255) NOT NULL,
        telefono    VARCHAR(20),
        created_at  TIMESTAMP DEFAULT NOW(),
        updated_at  TIMESTAMP DEFAULT NOW()
      )
    `)
    console.log('✅ Tabla clientes creada')

    await client.query(`
      CREATE TABLE IF NOT EXISTS direcciones_clientes (
        id            SERIAL PRIMARY KEY,
        cliente_id    INTEGER REFERENCES clientes(id) ON DELETE CASCADE,
        alias         VARCHAR(50) DEFAULT 'Casa',
        calle         TEXT,
        ciudad        VARCHAR(100),
        estado        VARCHAR(100),
        codigo_postal VARCHAR(10),
        pais          VARCHAR(50) DEFAULT 'MX',
        es_default    BOOLEAN DEFAULT false,
        created_at    TIMESTAMP DEFAULT NOW()
      )
    `)
    console.log('✅ Tabla direcciones_clientes creada')

    await client.query('COMMIT')
    console.log('🎉 Migración completa')
  } catch (err) {
    await client.query('ROLLBACK')
    console.error('❌ Error en migración:', err.message)
  } finally {
    client.release()
    await pool.end()
  }
}

migrate()
