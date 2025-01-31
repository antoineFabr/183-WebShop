CREATE DATABASE db_login;
/*ensuite executer ce script*/
use db_login;
CREATE TABLE T_user(
   userId INT AUTO_INCREMENT,
   addresseMail VARCHAR(50),
   motDePasse VARCHAR(50),
   PRIMARY KEY(userId),
   sel VARCHAR(50)
);

