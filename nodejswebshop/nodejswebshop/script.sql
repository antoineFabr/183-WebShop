--créer la base de données
CREATE DATABASE db_login;
--entrer dans cette DB
use db_login;
--créer la table T_user avec un id, une adresse mail,
--un mot de passe et un sel.
CREATE TABLE T_user(
   userId INT AUTO_INCREMENT,
   addresseMail VARCHAR(50),
   motDePasse VARCHAR(50),
   PRIMARY KEY(userId),
   sel VARCHAR(50),
   UNIQUE (addresseMail)
);

