create table user(
  id: int serial primary key,
  username: char(50) UNIQUE,
  email: char(100);
)