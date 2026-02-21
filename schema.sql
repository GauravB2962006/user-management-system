create table user(
    id varchar(30) primary key,
    username varchar(30) unique,
    email varchar(50) unique not null,
    password varchar(40) not null
);

