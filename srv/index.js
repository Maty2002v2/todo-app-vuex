import express from 'express';
import mysql from 'mysql';
import bodyParser from 'body-parser';
import cors from 'cors';
// import socketIO from "socket.io";

const port = process.env.PORT || 5000;

const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'todo'
});

export default (app, http) => {
  app.use(express.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(cors());
  
  app.get('/all', (req, res) => {

    pool.getConnection((err, connection) => {
      if (err) throw err;

      console.log(`conected as id ${connection.threadId}`)

      // //query(sqlString, callback)
      connection.query('SELECT * FROM zadania', (err, rows) => {
          connection.release();
          if (!err) {
              res.send(rows);
          } else {
              console.log(err)
          }
      })
    })
  });

  app.get('/completed', (req, res) => {

    pool.getConnection((err, connection) => {
        if (err) throw err;

        console.log(`conected as id ${connection.threadId}`)

        //query(sqlString, callback)
        connection.query('SELECT * FROM zadania WHERE wykonano = "tak"', (err, rows) => {
            connection.release();

            if (!err) {
                res.send(rows);
            } else {
                console.log(err)
            }
        })
    })
  });
  
  app.post('/', (req, res) => {

    pool.getConnection((err, connection) => {
        if (err) throw err;

        const params = req.body;
        connection.query('INSERT INTO zadania SET ?', params, (err, rows) => {
            connection.release();

            if (!err) {
                res.send(`Beer with the record ID  has been added.`);
            } else {
                console.log(err);
            }

            console.log('The data from beer table are:11 \n', rows);

        })
    })
  });

  app.delete('/:id', (req, res) => {
      pool.getConnection((err, connection) => {
          if (err) throw err;
          console.log(`conected as id ${connection.threadId}`)

          //query(sqlString, callback)
          connection.query('DELETE FROM zadania WHERE id = ?', [req.params.id], (err, rows) => {
              connection.release();

              if (!err) {
                  res.send(`Zadanie z ID ${req.params.id} został usuniety`);
              } else {
                  console.log(err)
              }
          })
      })
  });

  app.post('/bar', (req, res) => {
    res.json(req.body);
  });
  
  // optional support for socket.io
  
  // let io = socketIO(http);
  // io.on("connection", client => {
  //   client.on("message", function(data) {
  //     // do something
  //   });
  //   client.emit("message", "Welcome");
  // });
}
