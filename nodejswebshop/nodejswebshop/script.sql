CREATE DATABASE db_login;
/*ensuite executer ce script*/
CREATE TABLE T_user(
   userId INT AUTO_INCREMENT,
   addresseMail VARCHAR(50),
   motDePasse VARCHAR(50),
   PRIMARY KEY(userId)
);

