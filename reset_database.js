// Reset database to load new lesson content
import { query, initializeDatabase } from './server/db.js';

async function resetDatabase() {
    console.log('🔄 Resetting database...');
    
    try {
        // Drop tables in reverse dependency order
        console.log('Dropping tables...');
        await query('DROP TABLE IF EXISTS audit_logs CASCADE;');
        await query('DROP TABLE IF EXISTS lesson_completions CASCADE;');
        await query('DROP TABLE IF EXISTS submissions CASCADE;');
        await query('DROP TABLE IF EXISTS assignments CASCADE;');
        await query('DROP TABLE IF EXISTS lessons CASCADE;');
        await query('DROP TABLE IF EXISTS enrollments CASCADE;');
        await query('DROP TABLE IF EXISTS courses CASCADE;');
        await query('DROP TABLE IF EXISTS app_users CASCADE;');
        
        console.log('✅ Tables dropped');
        
        // Reinitialize with new content
        console.log('Initializing database with new content...');
        await initializeDatabase();
        
        console.log('✅ Database reset complete!');
        console.log('');
        console.log('📚 New lessons loaded:');
        const lessons = await query('SELECT id, title, LEFT(content, 80) as preview FROM lessons ORDER BY id;');
        lessons.rows.forEach(lesson => {
            console.log(`  Lesson ${lesson.id}: ${lesson.title}`);
            console.log(`    ${lesson.preview}...`);
        });
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error resetting database:', error.message);
        process.exit(1);
    }
}

resetDatabase();
