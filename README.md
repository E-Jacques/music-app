# music-app
Music app for studies



BACKEND/MAIN
Branch for everything tied to backend development. Needed for databases. Pgsql and ksqldb are used. Contains ERD of project. ERD displays the full diagram for the project, seperated between pgsql and ksqldb. Pgsql stores everything but Music table's Likes, Views and Bytes for streaming, which are implemented through ksqldb. Ksqldb contains Music tables and streams and additional comment stream to show latest comment.
