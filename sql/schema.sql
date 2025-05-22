
CREATE TYPE event_category AS ENUM ('tech', 'webinars','workshops');

-- Enable pgcrypto extension for hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;


CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX idx_users_email ON users(email);



CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  location VARCHAR(100),
  date TIMESTAMP,
  event_image TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by INT NOT NULL,
  category event_category,
  status BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (created_by) REFERENCES users(id)
);



-- // user register for event 
CREATE TABLE registrations (
  id SERIAL PRIMARY KEY,
  event_id INT NOT NULL,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (event_id) REFERENCES events(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_registrations_event_id ON registrations(event_id);


CREATE OR REPLACE FUNCTION hash_user_password() 
RETURNS TRIGGER AS $$
BEGIN
  NEW.password := crypt(NEW.password, gen_salt('bf', 8)); 
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;



--  hash user password before insert

CREATE TRIGGER hashing
BEFORE INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION hash_user_password();



