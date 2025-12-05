@echo off
echo Setting up Supabase database...
echo.
echo You will be prompted for the password: W@msducus123
echo.
psql -h db.esdklxghavldvwunxwmr.supabase.co -p 5432 -d postgres -U postgres -f supabase-setup.sql
echo.
echo Database setup complete!
pause
