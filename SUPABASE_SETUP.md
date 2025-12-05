# Supabase Setup Instructions

## Option 1: Using Supabase Dashboard (Recommended)
1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project (esdklxghavldvwunxwmr)
3. Click on "SQL Editor" in the left sidebar
4. Click "New Query"
5. Copy the contents of `supabase-setup.sql`
6. Paste and click "Run" to execute the SQL script

## Option 2: Using PostgreSQL Client
If you have psql installed, run:
```bash
psql "postgresql://postgres:W@msducus123@db.esdklxghavldvwunxwmr.supabase.co:5432/postgres" -f supabase-setup.sql
```

## Verify Setup
Go to "Table Editor" in Supabase dashboard and verify these tables exist:
- users
- messages

## Test Authentication
The app is now ready! Users can sign up and sign in at http://localhost:3001/

Create test accounts through the app's sign-up flow.
