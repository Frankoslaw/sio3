CREATE DATABASE IF NOT EXISTS userservice;
CREATE DATABASE IF NOT EXISTS competitionservice;
CREATE DATABASE IF NOT EXISTS taskservice;

CREATE OR REPLACE USER 'user1' IDENTIFIED BY 'password';
CREATE OR REPLACE USER 'user2' IDENTIFIED BY 'password';
CREATE OR REPLACE USER 'user3' IDENTIFIED BY 'password';

GRANT ALL privileges ON `userservice`.* TO 'user1'@'%' IDENTIFIED BY 'password';
GRANT ALL privileges ON `competitionservice`.* TO 'user2'@'%' IDENTIFIED BY 'password';
GRANT ALL privileges ON `taskservice`.* TO 'user3'@'%' IDENTIFIED BY 'password';

FLUSH PRIVILEGES;