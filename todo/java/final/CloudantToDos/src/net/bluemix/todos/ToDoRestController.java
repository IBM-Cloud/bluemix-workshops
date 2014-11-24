/*
 * Copyright IBM Corp. 2014
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package net.bluemix.todos;

import java.util.List;

import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.ektorp.CouchDbConnector;
import org.ektorp.CouchDbInstance;
import org.ektorp.impl.StdCouchDbConnector;

@Path("/todos")
public class ToDoRestController {
  private static ToDoRepository repo;
  
  public ToDoRestController() throws NamingException {
    if(repo == null) {
      CouchDbInstance db = (CouchDbInstance) new InitialContext().lookup("java:comp/env/couchdb/todo-cloudant");
      repo = getToDoRespository(getCouchDbConnector(db));
    }
  }
  
  private CouchDbConnector getCouchDbConnector(CouchDbInstance couchDbInstance) {
    CouchDbConnector connector = new StdCouchDbConnector("todos", couchDbInstance);
    connector.createDatabaseIfNotExists();
    return connector;
  }
  
  private ToDoRepository getToDoRespository(CouchDbConnector connector) {
    return new ToDoRepository(connector);
  }

  @GET
  @Produces(MediaType.APPLICATION_JSON)
  public List<ToDo> getAll() {
    return repo.getAll();
  }
  
  @POST
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public ToDo create(ToDo td) {
    repo.add(td);
    return td;
  }
  
  @DELETE
  @Path("{id}")
  public void delete(@PathParam("id") String id) {
    ToDo td = repo.get(id);
    repo.remove(td);
  }
  
  @PUT
  @Path("{id}")
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public ToDo udpate(@PathParam("id") String id, ToDo td) {
    ToDo update = repo.get(id);
    update.setCompleted(td.isCompleted());
    update.setOrder(td.getOrder());
    update.setTitle(td.getTitle());
    repo.update(update);
    return update;
  }
}