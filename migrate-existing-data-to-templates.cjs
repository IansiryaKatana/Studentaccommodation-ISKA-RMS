const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function migrateExistingDataToTemplates() {
  try {
    console.log('🚀 Starting migration of existing data to academic year templates...');

    // Step 1: Get current academic year (2025/2026)
    const currentAcademicYear = '2025/2026';
    console.log(`📅 Migrating data for academic year: ${currentAcademicYear}`);

    // Step 2: Migrate Installment Plans
    console.log('💳 Migrating installment plans...');
    const { data: installmentPlans, error: plansError } = await supabase
      .from('installment_plans')
      .select('*')
      .eq('is_active', true);

    if (plansError) throw plansError;

    for (const plan of installmentPlans || []) {
      const { error: insertError } = await supabase
        .from('academic_year_installment_plans')
        .upsert({
          installment_plan_id: plan.id,
          academic_year: currentAcademicYear,
          due_dates: plan.due_dates || [],
          deposit_amount: plan.deposit_amount || 500,
          is_active: true
        }, { onConflict: 'installment_plan_id,academic_year' });

      if (insertError) {
        console.error(`Error migrating installment plan ${plan.name}:`, insertError);
      } else {
        console.log(`✅ Migrated installment plan: ${plan.name}`);
      }
    }

    // Step 3: Migrate Room Grades
    console.log('🏠 Migrating room grades...');
    const { data: roomGrades, error: gradesError } = await supabase
      .from('room_grades')
      .select('*')
      .eq('is_active', true);

    if (gradesError) throw gradesError;

    for (const grade of roomGrades || []) {
      const { error: insertError } = await supabase
        .from('academic_year_room_grades')
        .upsert({
          room_grade_id: grade.id,
          academic_year: currentAcademicYear,
          weekly_rate: grade.weekly_rate,
          is_active: true
        }, { onConflict: 'room_grade_id,academic_year' });

      if (insertError) {
        console.error(`Error migrating room grade ${grade.name}:`, insertError);
      } else {
        console.log(`✅ Migrated room grade: ${grade.name} (£${grade.weekly_rate})`);
      }
    }

    // Step 4: Migrate Pricing Matrix
    console.log('💰 Migrating pricing matrix...');
    const { data: pricingMatrix, error: pricingError } = await supabase
      .from('pricing_matrix')
      .select('*')
      .eq('is_active', true);

    if (pricingError) throw pricingError;

    for (const pricing of pricingMatrix || []) {
      const { error: insertError } = await supabase
        .from('academic_year_pricing_matrix')
        .upsert({
          room_grade_id: pricing.room_grade_id,
          duration_id: pricing.duration_id,
          academic_year: currentAcademicYear,
          weekly_rate_override: pricing.weekly_rate_override,
          is_active: true
        }, { onConflict: 'room_grade_id,duration_id,academic_year' });

      if (insertError) {
        console.error(`Error migrating pricing matrix entry:`, insertError);
      } else {
        console.log(`✅ Migrated pricing matrix entry`);
      }
    }

    // Step 5: Verify migration
    console.log('🔍 Verifying migration...');
    
    const { data: migratedPlans } = await supabase
      .from('academic_year_installment_plans')
      .select('*')
      .eq('academic_year', currentAcademicYear);

    const { data: migratedGrades } = await supabase
      .from('academic_year_room_grades')
      .select('*')
      .eq('academic_year', currentAcademicYear);

    const { data: migratedPricing } = await supabase
      .from('academic_year_pricing_matrix')
      .select('*')
      .eq('academic_year', currentAcademicYear);

    console.log('📊 Migration Summary:');
    console.log(`   - Installment Plans: ${migratedPlans?.length || 0} migrated`);
    console.log(`   - Room Grades: ${migratedGrades?.length || 0} migrated`);
    console.log(`   - Pricing Matrix: ${migratedPricing?.length || 0} migrated`);

    console.log('🎉 Migration completed successfully!');
    console.log('✅ Existing 2025/2026 data has been migrated to academic year templates');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error('Full error:', error);
  }
}

migrateExistingDataToTemplates();
