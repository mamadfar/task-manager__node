DROP TABLE IF EXISTS tasks;

CREATE TABLE tasks (
	id INT NOT NULL AUTO_INCREMENT,
	title VARCHAR(50) NOT NULL,
	completed TINYINT NOT NULL,
	PRIMARY KEY (id),
	UNIQUE INDEX title_UNIQUE (title),
	INDEX completed_idx (completed)
);

INSERT INTO tasks(title , completed) VALUES('Learn HTML', 1),('Learn CSS', 1),('Learn Sass', 1),('Learn JavaScript', 1),
('Learn TypeScript', 0),('Learn Node.js', 1),('Learn Deno', 0),('Learn React', 1),('Learn Vue', 1),('Learn Angular', 0),
('Learn PHP', 0),('Learn jQuery', 1),('Learn Axios', 0),('Learn Lodash', 0),('Learn Express', 0),('Learn MySQL', 0),
('Learn MongoDB', 0),('Learn YAML', 1),('Learn XML', 1),('Learn JSON', 1),('Learn C#', 1),('Learn Bun', 0),
('Learn Docker', 1),('Learn Redis', 1),('Learn RabbitMQ', 1),('Learn Kubernetes', 1),('Learn Bootstrap', 0),
('Learn Tailwind', 1),('Learn Ionic', 1),('Learn Capacitor', 1),('Learn Material Design', 0),
('Learn Vue Router', 1),('Learn Kotlin', 1),('Learn Vuetify', 0),('Learn VB.Net', 1),('Learn Redux', 1),
('Learn React Router', 1),('Learn Linux', 0),('Learn Java', 0),('Learn Android Development', 0);