CREATE DATABASE IF NOT EXISTS db_auth;
CREATE DATABASE IF NOT EXISTS db_vehicles;
CREATE DATABASE IF NOT EXISTS db_traffic;
CREATE DATABASE IF NOT EXISTS db_incidents;
CREATE DATABASE IF NOT EXISTS db_notifications;

GRANT ALL PRIVILEGES ON db_auth.* TO 'urban_user'@'%';
GRANT ALL PRIVILEGES ON db_vehicles.* TO 'urban_user'@'%';
GRANT ALL PRIVILEGES ON db_traffic.* TO 'urban_user'@'%';
GRANT ALL PRIVILEGES ON db_incidents.* TO 'urban_user'@'%';
GRANT ALL PRIVILEGES ON db_notifications.* TO 'urban_user'@'%';
FLUSH PRIVILEGES;