var path = require('path');

// Postgres DATABASE_URL = postgres://user:passwd@host:port/database
// SQLite   DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name = (url[6]||null);
var user = (url[2]||null);
var pwd = (url[3]||null);
var protocol = (url[1]||null);
var dialect = (url[1]||null);
var port = (url[5]||null);
var host = (url[4]||null);
var storage = process.env.DATABASE_STORAGE;

// Cargar el Modelo ORM
var Sequelize = require('sequelize');

//  Usar BBDD SQLite o Postgres dependiendo si estamos trabajando
// en entorno de desarrollo local o en despliegue en heroku

var sequelize = new Sequelize(DB_name, user, pwd,
		{ dialect: protocol,
		  protocol: protocol,
		  port: port,
		  host: host,
		  storage: storage, // solo SQLite (.env)
		  omitNull: true // solo Postgres
		}
	);

//  Usar BBDD SQLite
//
//var sequelize = new Sequelize(null, null, null,
//						{dialect: "sqlite", storage: "quiz.sqlite"}
//					);

// Importar la definición de la tabla Quiz que definimos en quiz.js

var Quiz = sequelize.import(path.join(__dirname, 'quiz'));


// Importar definicion de la tabla Comment
var comment_path = path.join(__dirname,'comment');
var Comment = sequelize.import(comment_path);

Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

// Exportar la definición de la tabla Quiz y Comment

exports.Quiz = Quiz;
exports.Comment = Comment;

// Crear e inicializar Base de Datos

sequelize.sync().then(function() {
	// success(...) ejecuta el manejador una vez creada la tabla

	Quiz.count().then(function(count) {
		if (count === 0) {
		      Quiz.bulkCreate( 
	  	[ {pregunta: 'Capital de Italia',   respuesta: 'Roma', tema:'Humanidades'},
          {pregunta: 'Capital de Portugal', respuesta: 'Lisboa', tema:'Humanidades'}
        ]
   		   ).then(function(){console.log('Base de datos inicializada')});
		};
	});
});