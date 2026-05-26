/**
 * Run once to create ad_prices table and seed existing ad pricing into Supabase.
 * Usage: npx tsx scripts/seed-ads.ts
 *
 * You must first create the table in Supabase SQL editor:
 *
 * create table ad_prices (
 *   id bigint generated always as identity primary key,
 *   category text not null,
 *   name text not null,
 *   price text not null,
 *   note text,
 *   sort_order int default 0,
 *   created_at timestamptz default now()
 * );
 * alter table ad_prices enable row level security;
 * create policy "Public read" on ad_prices for select using (true);
 * create policy "Service write" on ad_prices for all using (auth.role() = 'service_role');
 */
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const adPrices = [
  { category: "Advert Repost", name: "Link Only", price: "6000", note: null, sort_order: 1 },
  { category: "Advert Repost", name: "Link & Picture", price: "8000", note: null, sort_order: 2 },
  { category: "Advert Repost", name: "Link & Video", price: "10000", note: null, sort_order: 3 },
  { category: "Advert Repost", name: "Demo (With Prod)", price: "40000", note: "Includes TikTok/Snap Story", sort_order: 4 },
  { category: "Advert Repost", name: "Demo (No Prod)", price: "50000", note: "Includes TikTok/Snap Story", sort_order: 5 },
  { category: "Influencing", name: "One Week", price: "100000", note: "Includes TikTok/Snap Story", sort_order: 1 },
  { category: "Influencing", name: "Two Weeks", price: "150000", note: "Includes TikTok/Snap Story", sort_order: 2 },
  { category: "Influencing", name: "One Month", price: "250000", note: "Includes TikTok/Snap Story", sort_order: 3 },
  { category: "Ambassador Deal", name: "3 Months", price: "Contact Us", note: null, sort_order: 1 },
  { category: "Ambassador Deal", name: "6 Months", price: "Contact Us", note: null, sort_order: 2 },
  { category: "Ambassador Deal", name: "1 Year", price: "Contact Us", note: null, sort_order: 3 },
];

async function seed() {
  console.log('Seeding ad prices...');
  const { error } = await supabase.from('ad_prices').upsert(adPrices, { onConflict: 'category,name' });
  if (error) console.error('Ad price seed error:', error.message);
  else console.log(`✓ Seeded ${adPrices.length} ad price entries`);
  console.log('Done!');
}

seed();
