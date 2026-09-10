import pg from "pg";

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not configured.");
}

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

function convertPlaceholders(query: string) {
  let index = 0;

  return query.replace(/\?/g, () => {
    index += 1;
    return `$${index}`;
  });
}

function normalizeSql(query: string) {
  return query
    .replace(/is_active\s*=\s*1/g, "is_active = TRUE")
    .replace(/is_active\s*=\s*0/g, "is_active = FALSE")
    .replace(/SET is_active = 0/g, "SET is_active = FALSE")
    .replace(/SET is_active = 1/g, "SET is_active = TRUE");
}

function prepareQuery(query: string) {
  return convertPlaceholders(normalizeSql(query));
}

export async function getDb() {
  return {
    async get(query: string, params: unknown[] = []) {
      const result = await pool.query(prepareQuery(query), params);
      return result.rows[0];
    },

    async all(query: string, params: unknown[] = []) {
      const result = await pool.query(prepareQuery(query), params);
      return result.rows;
    },

    async run(query: string, params: unknown[] = []) {
      let sql = prepareQuery(query);

      const isInsert = sql.trim().toLowerCase().startsWith("insert");
      const hasReturning = sql.toLowerCase().includes("returning");

      if (isInsert && !hasReturning) {
        sql += " RETURNING id";
      }

      const result = await pool.query(sql, params);

      return {
        lastID: result.rows[0]?.id,
        changes: result.rowCount
      };
    },

    async exec(query: string) {
      return pool.query(normalizeSql(query));
    },

    async query(query: string, params: unknown[] = []) {
      return pool.query(prepareQuery(query), params);
    }
  };
}

export async function withTransaction<T>(
      callback: (db: {
        get: (query: string, params?: unknown[]) => Promise<any>;
        all: (query: string, params?: unknown[]) => Promise<any[]>;
        run: (
          query: string,
          params?: unknown[]
        ) => Promise<{
          lastID: any;
          changes: number | null;
        }>;
        query: (query: string, params?: unknown[]) => Promise<any>;
      }) => Promise<T>
    ): Promise<T> {
      const client = await pool.connect();

      const transactionDb = {
        async get(query: string, params: unknown[] = []) {
          const result = await client.query(
            prepareQuery(query),
            params
          );

          return result.rows[0];
        },

        async all(query: string, params: unknown[] = []) {
          const result = await client.query(
            prepareQuery(query),
            params
          );

          return result.rows;
        },

        async run(query: string, params: unknown[] = []) {
          let sql = prepareQuery(query);

          const isInsert = sql
            .trim()
            .toLowerCase()
            .startsWith("insert");

          const hasReturning = sql
            .toLowerCase()
            .includes("returning");

          if (isInsert && !hasReturning) {
            sql += " RETURNING id";
          }

          const result = await client.query(sql, params);

          return {
            lastID: result.rows[0]?.id,
            changes: result.rowCount
          };
        },

        async query(query: string, params: unknown[] = []) {
          return client.query(
            prepareQuery(query),
            params
          );
        }
      };

      try {
        await client.query("BEGIN");

        const result = await callback(transactionDb);

        await client.query("COMMIT");

        return result;
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      } finally {
        client.release();
      }
}