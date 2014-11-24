//------------------------------------------------------------------------------
// Copyright IBM Corp. 2014
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//------------------------------------------------------------------------------

var express = require("express");
var fs = require('fs');
var http = require('http');
var path = require('path');
var optional = require('optional');
var cfenv = require('cfenv');
var cloudantLocal = optional('./cloudant.json');
var CloudantApis = require('cloudant');
var appEnv = cfenv.getAppEnv();
var cloudantService;
if(appEnv.isLocal) {
  if(cloudantLocal) {
    cloudantService = cloudantLocal.cloudantNoSQLDB;
  }
} else {
  cloudantService = appEnv.getService('todo-cloudant');  
}
if(!cloudantService || cloudantService == null) {
  throw new Error('No Cloudant service found.');
}

var todoDb;
function getToDoDb(cb) {
  if(todoDb) {
    cb(undefined, todoDb);
  } else {
    CloudantApis({account:cloudantService.credentials.username, password:cloudantService.credentials.password}, 
      function(err, cloudant) {
        console.log('Logged into cloudant');
          if(err) {
            cb(err);
          } else {
            cb(err, cloudant.db.use('todos'));
          }
      }
    );
  }
};

var app = express();
app.set('port', process.env.VCAP_APP_PORT || 3000);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Serve up our static resources
app.get('/', function(req, res) {
  fs.readFile('./public/index.html', function(err, data) {
    res.end(data);
  });
});

app.get('/api/todos', function(req, res) {
  todoDb.list({"include_docs": true}, function(err, body) {
    if(err) {
      res.send(500, err);
    } else {
      res.end(JSON.stringify(body.rows.map(function(row) {
        return {
          "id" : row.doc._id,
          "rev" : row.doc._rev,
          "title" : row.doc.title,
          "order" : row.doc.order,
          "completed" : row.doc.completed
        }
      })));
    }
  });
});

app.put('/api/todos/:id', function(req, res) {
  var todo = req.body;
  todoDb.get(req.params.id, function(err, update) {
    if(err) {
      res.send(500, err);
    } else {
      update.title = todo.title;
      update.completed = todo.completed;
      update.order = todo.order;
      todoDb.insert(update, function(err, body) {
        if(err) {
          res.send(500, err);
        } else {
          res.end(JSON.stringify(update));
        }
      });
    }
  });
});

app.post('/api/todos', function(req, res) {
  var todo = req.body;
  todoDb.insert(todo, function(err, body) {
    if(err) {
      res.send(500, err);
    } else {
      todo.id = body.id
      todo.rev = body.rev;
      res.end(JSON.stringify(todo));
    }
  });
});

app.delete('/api/todos/:id', function(req, res) {
  todoDb.get(req.params.id, function(err, body) {
    if(err) {
      res.send(500, err);
    } else {
      body._deleted = true;
      todoDb.bulk({"docs": [body]}, {}, function(err, result) {
        if(err) {
          res.send(500, err);
        } else {
          res.send(204);
        }
      });
    }
  });
});

getToDoDb(function(err, db) {
  if(err) {
    throw err;
  } else {
    todoDb = db;
    http.createServer(app).listen(app.get('port'), function(){
      console.log('Express server listening on port ' + app.get('port'));
    });  
  }
});
