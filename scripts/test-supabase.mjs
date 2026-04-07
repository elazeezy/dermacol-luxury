import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://nxrihuegovdlqnnkzgsf.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54cmlodWVnb3ZkbHFubmt6Z3NmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1MzY1MzQsImV4cCI6MjA5MTExMjUzNH0.7bHMsZguxmuRbefiOKxfvZE6C67sWO0dKzQVYl3LZ08'
);

async function checkPhase1() {
  console.log('\n🔍 Checking Phase 1 setup...\n');

  // 1. Check products table
  const { error: productsErr } = await supabase.from('products').select('id').limit(1);
  if (productsErr) {
    console.log('❌ products table — NOT FOUND. Did you run the first SQL block?');
  } else {
    console.log('✅ products table — exists and accessible');
  }

  // 2. Check orders table
  const { error: ordersErr } = await supabase.from('orders').select('id').limit(1);
  if (ordersErr) {
    console.log('❌ orders table — NOT FOUND. Did you run the first SQL block?');
  } else {
    console.log('✅ orders table — exists and accessible');
  }

  // 3. Check storage bucket (list files inside it — works with anon on public buckets)
  const { error: bucketErr } = await supabase.storage.from('product-images').list('', { limit: 1 });
  if (bucketErr) {
    console.log('❌ product-images bucket — NOT FOUND. Did you create it in Storage?');
  } else {
    console.log('✅ product-images bucket — exists and accessible');
  }

  console.log('\n🔑 Connection itself — working (you\'re seeing this message)\n');
}

checkPhase1();
