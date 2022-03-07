CREATE TABLE "users" (
  "id" uuid PRIMARY KEY NOT NULL,
  "name" varchar,
  "email" varchar,
  "username" varchar,
  "password" varchar,
  "address" text,
  "previlage" varchar,
  "active" boolean,
  "image_url" varchar,
  "created_at" timestamp,
  "updated_at" timestamp
);

CREATE TABLE "materi" (
  "id" uuid PRIMARY KEY NOT NULL,
  "author_id" uuid,
  "title" text,
  "description" text,
  "thumbnail" varchar,
  "url" varchar,
  "type" integer,
  "view" integer,
  "like" integer,
  "created_at" timestamp,
  "updated_at" timestamp
);

CREATE TABLE "take_materi" (
  "id" uuid PRIMARY KEY NOT NULL,
  "student_id" uuid,
  "created_at" timestamp,
  "updated_at" timestamp
);

CREATE TABLE "take_materi_items" (
  "id" uuid PRIMARY KEY NOT NULL,
  "take_materi_id" uuid,
  "materi_id" uuid,
  "created_at" timestamp,
  "updated_at" timestamp
);

CREATE TABLE "quiz" (
  "id" uuid PRIMARY KEY NOT NULL,
  "quiz_type_id" uuid NOT NULL,
  "question" text,
  "correct_answer" varchar,
  "incorrect_answers" varchar,
  "created_at" timestamp,
  "updated_at" timestamp
);

CREATE TABLE "message" (
  "id" uuid PRIMARY KEY NOT NULL,
  "group_id" uuid,
  "user_id" uuid,
  "message" text,
  "created_at" timestamp,
  "updated_at" timestamp
);

CREATE TABLE "group" (
  "id" uuid PRIMARY KEY NOT NULL,
  "name" varchar,
  "created_at" timestamp,
  "updated_at" timestamp
);

CREATE TABLE "group_users" (
  "id" uuid PRIMARY KEY NOT NULL,
  "group_id" uuid,
  "user_id" uuid,
  "created_at" timestamp,
  "updated_at" timestamp
);

CREATE TABLE "contact_teacher" (
  "id" uuid PRIMARY KEY NOT NULL,
  "author_id" uuid,
  "name" varchar,
  "email" varchar,
  "phone" varchar,
  "address" text,
  "image_url" text,
  "job_desc" text,
  "edu_title" varchar,
  "created_at" timestamp,
  "updated_at" timestamp
);

CREATE TABLE "quiz_type" (
  "id" uuid PRIMARY KEY NOT NULL,
  "user_id" uuid NOT NULL,
  "title" varchar,
  "created_at" timestamp,
  "updated_at" timestamp
);

ALTER TABLE "materi" ADD FOREIGN KEY ("author_id") REFERENCES "users" ("id");

ALTER TABLE "take_materi" ADD FOREIGN KEY ("student_id") REFERENCES "users" ("id");

ALTER TABLE "take_materi_items" ADD FOREIGN KEY ("take_materi_id") REFERENCES "take_materi" ("id");

ALTER TABLE "take_materi_items" ADD FOREIGN KEY ("materi_id") REFERENCES "materi" ("id");

ALTER TABLE "message" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "message" ADD FOREIGN KEY ("group_id") REFERENCES "group" ("id");

ALTER TABLE "group_users" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "group_users" ADD FOREIGN KEY ("group_id") REFERENCES "group" ("id");

ALTER TABLE "contact_teacher" ADD FOREIGN KEY ("author_id") REFERENCES "users" ("id");

ALTER TABLE "quiz" ADD FOREIGN KEY ("quiz_type_id") REFERENCES "quiz_type" ("id");

ALTER TABLE "quiz_type" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");
