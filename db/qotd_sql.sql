--
-- File generated with SQLiteStudio v3.1.1 on Thu Apr 19 12:00:40 2018
--
-- Text encoding used: System
--
PRAGMA foreign_keys = off;
BEGIN TRANSACTION;

-- Table: qotd
CREATE TABLE qotd (
    qid        STRING PRIMARY KEY,
    locationid STRING REFERENCES locations (id),
    ques       STRING,
    imgloc     STRING
);

INSERT INTO qotd (qid, locationid, ques, imgloc) VALUES (1, 'mum', '-.-. ...- . -....- ..--- ----- .---- --... -....- ..... --... ..... ...--
<br><br>
.. / .- -- / - .... . / ... . - / --- ..-. / .-. ..- .-.. . ... / -.. ..- . / - --- / .-- .... .. -.-. .... / - .... .. ... / .... .- ... / .- ..-. ..-. . -.-. - . -.. / ..- ... / .- .-.. .-.. .-.-.- / .- ..-. - . .-. / -- -.-- / -.-. .-. . .- - --- .-. / .- -- / .. / -. .- -- . -.. / .- -. -.. / .. / .- -- / - .... . / -.- . -.-- / --- ..-. / - .... . / -.- . -.-- .-- --- .-. -.. / - .... .- - / ... --- .-.. ...- . ... / - .... . / ..-. --- .-.. .-.. --- .-- .. -. --. / . -. -.-. --- -.. .. -. --. .-.-.-
<br><br>
gy mnstqin wih th twtna osmtrps iu gs  orq ystnp tli qbs ptgs twtna wtp wih oy pigsihs wcqb qbs ptgs ucnpq htgs tp gy mnstqin bcp ftpqhtgs cp qbs thpwsn', '/images/noimage.png');

-- Table: qotd_ans
CREATE TABLE qotd_ans (
    qid    STRING REFERENCES qotd (qid),
    answer STRING,
    aid    STRING
);

INSERT INTO qotd_ans (qid, answer, aid) VALUES (1, 'barton', 'ans1');

-- Table: qotd_user_ans
CREATE TABLE qotd_user_ans (
    qid        STRING,
    answertime INTEGER,
    email      STRING,
    user       STRING,
    id         STRING,
    locationid STRING
);


COMMIT TRANSACTION;
PRAGMA foreign_keys = on;
