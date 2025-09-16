import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { writeFileSync, mkdirSync } from 'fs';

const url = process.env.VITE_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error('Missing env: VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });
const outDir = `backups/db-${new Date().toISOString().replace(/[:.]/g, '-')}`;
mkdirSync(outDir, { recursive: true });

async function dump(table, select = '*') {
  const { data, error } = await supabase.from(table).select(select);
  if (error) {
    console.error(`Error exporting ${table}:`, error.message);
    return [];
  }
  writeFileSync(`${outDir}/${table}.json`, JSON.stringify(data ?? [], null, 2));
  console.log(`Exported ${table}: ${data?.length ?? 0} rows`);
  return data ?? [];
}

async function main() {
  console.log('Export starting to', outDir);
  await dump('students');
  await dump('student_installments');
  await dump('installment_plans');
  await dump('invoices');
  await dump('reservations');
  await dump('module_styles');
  await dump('branding');
  console.log('Export complete');
}

main().catch((e) => { console.error(e); process.exit(1); });


