CREATE TABLE IF NOT EXISTS users (
  user_id TEXT PRIMARY KEY,
  email TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS profiles (
  user_id TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  bio TEXT,
  avatar TEXT,
  social_links JSON,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS auth_tokens (
  token TEXT UNIQUE NOT NULL,
  token_type TEXT NOT NULL,
  email TEXT NOT NULL,
  user_id TEXT,
  expires_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE If NOT EXISTS qr_codes (
  user_id TEXT PRIMARY KEY,
  qr_image BLOB NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS favorite_movies (
  movie_id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  poster_path TEXT,
  year TEXT
);

CREATE TABLE IF NOT EXISTS favorite_directors (
  director_id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  profile_path TEXT
);

CREATE TABLE IF NOT EXISTS favorite_actors (
  actor_id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  profile_path TEXT
);

CREATE TABLE IF NOT EXISTS user_favorite_movies (
  user_id TEXT NOT NULL,
  movie_id INTEGER NOT NULL,
  display_order INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, movie_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (movie_id) REFERENCES favorite_movies(movie_id)
);

CREATE TABLE IF NOT EXISTS user_favorite_directors (
  user_id TEXT NOT NULL,
  director_id INTEGER NOT NULL,
  display_order INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, director_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (director_id) REFERENCES favorite_directors(director_id)
);

CREATE TABLE IF NOT EXISTS user_favorite_actors (
  user_id TEXT NOT NULL,
  actor_id INTEGER NOT NULL,
  display_order INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, actor_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (actor_id) REFERENCES favorite_actors(actor_id)
);

CREATE TABLE IF NOT EXISTS user_favorite_genres (
  user_id TEXT NOT NULL,
  genre_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, genre_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_favorite_theaters (
  user_id TEXT NOT NULL,
  theaters TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_favorite_quote (
  user_id TEXT NOT NULL,
  text TEXT,
  title TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);