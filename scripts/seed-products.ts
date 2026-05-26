/**
 * Run once to seed all existing hardcoded products into Supabase.
 * Usage: npx tsx scripts/seed-products.ts
 */
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const wigs = [
  { id: 40, name: "Blend frontal & ponytail", inches: "Set", type: "Synthetic blend", old_price: "15k", new_price: 10000, media_url: "/products/wig40.mp4", is_video: true },
  { id: 43, name: "Blend frontal & 20\" ponytail", inches: "20 inches", type: "2 bundles", old_price: "20k", new_price: 15000, media_url: "/products/wig43.mp4", is_video: true },
  { id: 33, name: "Skull cap", inches: "Standard", type: "Essential", old_price: "20k", new_price: 15000, media_url: "/products/wig33.mp4", is_video: true },
  { id: 25, name: "Frontal & Curly Ponytail", inches: "Set", type: "Natural blend", old_price: "30k", new_price: 25000, media_url: "/products/wig25.jpg", is_video: false },
  { id: 42, name: "Fringe", inches: "Standard", type: "Human hair blend", old_price: "35k", new_price: 25000, media_url: "/products/wig42.mp4", is_video: true },
  { id: 46, name: "Tiwa Wig", inches: "Standard", type: "Black 25k | Colored 28k", old_price: "35k", new_price: 25000, media_url: "/products/wig46.jpg", is_video: false },
  { id: 22, name: "Fringe Bounce", inches: "Classic", type: "Natural blend", old_price: "35k", new_price: 28000, media_url: "/products/wig22.jpg", is_video: false },
  { id: 23, name: "Fringe Bounce", inches: "Short", type: "Natural blend", old_price: "35k", new_price: 28000, media_url: "/products/wig23.jpg", is_video: false },
  { id: 41, name: "Human hair frontal & ponytail", inches: "Set", type: "2 bundles curly", old_price: "40k", new_price: 30000, media_url: "/products/wig41.mp4", is_video: true },
  { id: 30, name: "Full Frontal tiwa curls", inches: "Luxury", type: "Human hair", old_price: "40k", new_price: 30000, media_url: "/products/wig30.jpg", is_video: false },
  { id: 48, name: "Kinky Band Wig", inches: "Standard", type: "Natural", old_price: "40k", new_price: 32000, media_url: "/products/wig48.jpg", is_video: false },
  { id: 45, name: "5 by 5 Bounce Unit", inches: "Standard", type: "Human hair blend", old_price: "45k", new_price: 32000, media_url: "/products/wig45.jpg", is_video: false },
  { id: 35, name: "Closure bounce", inches: "Short", type: "Human hair blend", old_price: "45k", new_price: 35000, media_url: "/products/wig35.mp4", is_video: true },
  { id: 31, name: "Full frontal short bounce", inches: "", type: "", old_price: "45k", new_price: 38000, media_url: "/products/wig31.jpg", is_video: false },
  { id: 24, name: "Frontal & Curly Ponytail", inches: "Set", type: "Human hair", old_price: "45k", new_price: 40000, media_url: "/products/wig24.jpg", is_video: false },
  { id: 47, name: "Curly Wig", inches: "Standard", type: "Any color", old_price: "50k", new_price: 40000, media_url: "/products/wig47.jpg", is_video: false },
  { id: 36, name: "5 by 5", inches: "Standard", type: "Human hair blend", old_price: "50k", new_price: 42000, media_url: "/products/wig36.mp4", is_video: true },
  { id: 37, name: "Full frontal bounce", inches: "Luxury", type: "Bounce", old_price: "50k", new_price: 42000, media_url: "/products/wig37.mp4", is_video: true },
  { id: 21, name: "Mila Bounce", inches: "Classic", type: "Human blend", old_price: "50k", new_price: 45000, media_url: "/products/wig21.jpg", is_video: false },
  { id: 44, name: "Human Hair", inches: "Standard", type: "Human hair", old_price: "55k", new_price: 45000, media_url: "/products/wig44.jpg", is_video: false },
  { id: 28, name: "Full Frontal Bounce", inches: "Short", type: "Luxury blend", old_price: "55k", new_price: 40000, media_url: "/products/wig28.jpg", is_video: false },
  { id: 29, name: "Full Frontal Bounce", inches: "Luxury", type: "Human hair blend", old_price: "55k", new_price: 40000, media_url: "/products/wig29.jpg", is_video: false },
  { id: 10, name: "Full Frontal Bounce", inches: "Luxury", type: "Human hair blend", old_price: "60k", new_price: 50000, media_url: "/products/wig10.jpg", is_video: false },
  { id: 14, name: "Full Frontal Blonde", inches: "Luxury", type: "Human hair blend", old_price: "60k", new_price: 50000, media_url: "/products/wig14.mp4", is_video: true },
  { id: 15, name: "Silky Straight Blonde", inches: "Full Frontal", type: "Human hair blend", old_price: "60k", new_price: 50000, media_url: "/products/wig15.mp4", is_video: true },
  { id: 16, name: "Silky Straight Blonde", inches: "Full Frontal", type: "Human hair blend", old_price: "60k", new_price: 50000, media_url: "/products/wig16.mp4", is_video: true },
  { id: 27, name: "Full Frontal Blonde Bounce", inches: "Luxury", type: "High quality human hair blend", old_price: "55k", new_price: 45000, media_url: "/products/wig27.jpg", is_video: false },
  { id: 32, name: "Full Frontal Bounce blonde", inches: "Luxury", type: "High quality human hair blend", old_price: "55k", new_price: 45000, media_url: "/products/wig32.jpg", is_video: false },
  { id: 7, name: "Full Frontal Bounce", inches: "Luxury", type: "Human hair", old_price: "65k", new_price: 55000, media_url: "/products/wig7.jpg", is_video: false },
  { id: 8, name: "Odogwu Luxury Bounce", inches: "Full Frontal", type: "Natural blend", old_price: "60k", new_price: 50000, media_url: "/products/wig8.mp4", is_video: true },
  { id: 9, name: "Odogwu Luxury Bounce", inches: "Full Frontal", type: "Chesnut blend", old_price: "60k", new_price: 50000, media_url: "/products/wig9.mp4", is_video: true },
  { id: 34, name: "Full frontal wavy unit", inches: "Standard", type: "HD Lace", old_price: "65k", new_price: 55000, media_url: "/products/wig34.mp4", is_video: true },
  { id: 38, name: "Jerry", inches: "16 inches", type: "Full frontal", old_price: "70k", new_price: 60000, media_url: "/products/wig38.jpg", is_video: false },
  { id: 39, name: "Celebrity fringe", inches: "Standard", type: "Human hair", old_price: "70k", new_price: 60000, media_url: "/products/wig39.mp4", is_video: true },
  { id: 12, name: "Deepwave", inches: "16 inches", type: "Full frontal", old_price: "75k", new_price: 60000, media_url: "/products/wig12.mp4", is_video: true },
  { id: 20, name: "Sdd Pixie", inches: "14 inches", type: "5 by 5 closure", old_price: "135k", new_price: 110000, media_url: "/products/wig20.jpg", is_video: false },
  { id: 17, name: "Vietnam Bonestraight", inches: "10 inches", type: "2 by 4 closure", old_price: "140k", new_price: 110000, media_url: "/products/wig17.mp4", is_video: true },
  { id: 19, name: "Vietnam Bonestraight", inches: "10 inches", type: "2 by 4 closure", old_price: "150k", new_price: 130000, media_url: "/products/wig19.mp4", is_video: true },
  { id: 5, name: "Bounce", inches: "18 inches", type: "Natural color 5 by 5", old_price: "180k", new_price: 165000, media_url: "/products/wig5.mp4", is_video: true },
  { id: 3, name: "Body Waves", inches: "30 inches", type: "Full frontal", old_price: "185k", new_price: 170000, media_url: "/products/wig3.jpg", is_video: false },
  { id: 4, name: "Pixie", inches: "20 inches", type: "5 by 5 (natural)", old_price: "195k", new_price: 180000, media_url: "/products/wig4.jpg", is_video: false },
  { id: 13, name: "Pixie", inches: "24 inches", type: "5 by 5", old_price: "270k", new_price: 245000, media_url: "/products/wig13.mp4", is_video: true },
  { id: 26, name: "BONESTRAIGHT BLONDE", inches: "20 INCHES", type: "2 BY 6 CLOSURE", old_price: "310k", new_price: 285000, media_url: "/products/wig26.jpg", is_video: false },
  { id: 2, name: "Deepwave", inches: "36 inches", type: "5 by 5 frontal", old_price: "320k", new_price: 295000, media_url: "/products/wig2.jpg", is_video: false },
  { id: 1, name: "Sdd Vietnam Bonestraight", inches: "26 inches", type: "300gm", old_price: "480k", new_price: 450000, media_url: "/products/wig1.jpg", is_video: false },
  { id: 6, name: "Piano Bonestraight", inches: "26 inches", type: "300gm", old_price: "580k", new_price: 550000, media_url: "/products/wig6.jpg", is_video: false },
  { id: 11, name: "Luxury Deepwave", inches: "40 inches", type: "Full frontal", old_price: "620k", new_price: 595000, media_url: "/products/wig11.mp4", is_video: true },
];

const foodItems = [
  { name: "Boli, Sauce & Turkey", inches: "", type: "", old_price: "", new_price: 4500, media_url: "/products/food-f1.jpg", is_video: false },
  { name: "Spaghetti & Turkey", inches: "", type: "", old_price: "", new_price: 4500, media_url: "/products/food-f2.jpg", is_video: false },
  { name: "Asun Spaghetti", inches: "", type: "", old_price: "", new_price: 5000, media_url: "/products/food-f3.jpg", is_video: false },
  { name: "Chicken & Chips", inches: "", type: "", old_price: "", new_price: 5000, media_url: "/products/food-f4.jpg", is_video: false },
  { name: "Noodles & Egg", inches: "", type: "", old_price: "", new_price: 2500, media_url: "/products/food-f5.jpg", is_video: false },
  { name: "Yam and Egg", inches: "", type: "", old_price: "", new_price: 3500, media_url: "/products/food-f6.jpg", is_video: false },
  { name: "Snail Snacks", inches: "", type: "", old_price: "", new_price: 6000, media_url: "/products/food-f7.jpg", is_video: false },
];

async function seed() {
  console.log('Seeding wigs...');
  const wigRows = wigs.map(({ id: _id, ...w }) => ({ ...w, category: 'beauty' }));
  const { error: wigError } = await supabase.from('products').upsert(wigRows, { onConflict: 'name,category' });
  if (wigError) console.error('Wig seed error:', wigError.message);
  else console.log(`✓ Seeded ${wigRows.length} wigs`);

  console.log('Seeding food items...');
  const foodRows = foodItems.map(f => ({ ...f, category: 'kitchen' }));
  const { error: foodError } = await supabase.from('products').upsert(foodRows, { onConflict: 'name,category' });
  if (foodError) console.error('Food seed error:', foodError.message);
  else console.log(`✓ Seeded ${foodRows.length} food items`);

  console.log('Done!');
}

seed();
