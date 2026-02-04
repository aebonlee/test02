const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Direct connection (not pooler)
const DATABASE_URL = 'postgresql://postgres:Wpd9UpRmZ0g9A1Pb@db.zwjmfewyshhwpgwdtrus.supabase.co:5432/postgres';

const sqlFiles = [
    '19-0_sample_test_users.sql',
    '19-1_create_payment_methods.sql',
    '20_create_billing_history.sql',
    '21_billing_rls_dev.sql',
    '22_sample_billing.sql'
];

async function executeSqlFiles() {
    const client = new Client({
        connectionString: DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        console.log('Connecting to Supabase PostgreSQL...');
        await client.connect();
        console.log('Connected!\n');

        for (const fileName of sqlFiles) {
            const filePath = path.join(__dirname, fileName);

            if (!fs.existsSync(filePath)) {
                console.log(`❌ File not found: ${fileName}`);
                continue;
            }

            console.log(`\n========================================`);
            console.log(`📄 Executing: ${fileName}`);
            console.log(`========================================`);

            const sql = fs.readFileSync(filePath, 'utf8');

            try {
                const result = await client.query(sql);
                console.log(`✅ ${fileName} - SUCCESS`);

                // 결과가 있으면 출력
                if (Array.isArray(result)) {
                    result.forEach((r, i) => {
                        if (r.rows && r.rows.length > 0) {
                            console.log(`   Result ${i + 1}:`, JSON.stringify(r.rows, null, 2));
                        }
                    });
                } else if (result.rows && result.rows.length > 0) {
                    console.log(`   Result:`, JSON.stringify(result.rows, null, 2));
                }
            } catch (err) {
                console.log(`❌ ${fileName} - FAILED`);
                console.log(`   Error: ${err.message}`);

                // 에러가 발생해도 계속 진행할지 결정
                if (err.message.includes('does not exist')) {
                    console.log(`   ⚠️  Stopping execution due to dependency error`);
                    break;
                }
            }
        }

    } catch (err) {
        console.error('Connection error:', err.message);
    } finally {
        await client.end();
        console.log('\n\nDatabase connection closed.');
    }
}

executeSqlFiles();
