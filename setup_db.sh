#!/bin/bash
sudo -u postgres psql -c "CREATE DATABASE fleetflows;"
sudo -u postgres psql -c "CREATE USER fleet_admin WITH PASSWORD 'SecureFleet2026!';"
sudo -u postgres psql -c "ALTER ROLE fleet_admin SET client_encoding TO 'utf8';"
sudo -u postgres psql -c "ALTER ROLE fleet_admin SET default_transaction_isolation TO 'read committed';"
sudo -u postgres psql -c "ALTER ROLE fleet_admin SET timezone TO 'UTC';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE fleetflows TO fleet_admin;"
sudo -u postgres psql -d fleetflows -c "GRANT ALL ON SCHEMA public TO fleet_admin;"
echo "Database setup complete."
