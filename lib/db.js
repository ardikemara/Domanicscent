import "server-only";
import postgres from "postgres";

let _sql = null;

// Lazy singleton so the build does not require the env var.
export function getSql() {
  if (!_sql) {
    const url = process.env.DOMANIC_DATABASE_URL;
    if (!url) {
      throw new Error(
        "DOMANIC_DATABASE_URL belum di-set. Isi connection string Supabase (yk-internal-portal) di environment variable."
      );
    }
    _sql = postgres(url, {
      prepare: false,        // wajib untuk transaction pooler (port 6543)
      ssl: "require",        // Supabase butuh SSL
      idle_timeout: 20,
      connect_timeout: 15,
      max: 3,
    });
  }
  return _sql;
}
