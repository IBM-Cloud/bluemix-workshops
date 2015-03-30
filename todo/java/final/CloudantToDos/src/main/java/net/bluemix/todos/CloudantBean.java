package net.bluemix.todos;

import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.inject.Produces;

import org.ektorp.CouchDbConnector;
import org.ektorp.CouchDbInstance;
import org.ektorp.impl.StdCouchDbConnector;
import org.springframework.cloud.Cloud;
import org.springframework.cloud.CloudFactory;

@ApplicationScoped
public class CloudantBean {
  
  private static Cloud cloud = new CloudFactory().getCloud();
  
  @Produces
  public ToDoRepository statusRepository() {
    CouchDbInstance db = cloud.getServiceConnector("todo-cloudant", CouchDbInstance.class, null /* default config */);
    CouchDbConnector connector = new StdCouchDbConnector("todos", db);
    connector.createDatabaseIfNotExists();
    return new ToDoRepository(connector);
  }
}
