package com.deloitte.ecommerce.config;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import com.deloitte.ecommerce.entity.Country;
import com.deloitte.ecommerce.entity.Product;
import com.deloitte.ecommerce.entity.ProductCategory;
import com.deloitte.ecommerce.entity.State;

import jakarta.persistence.EntityManager;
import jakarta.persistence.metamodel.EntityType;

@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer {

	private EntityManager entityManager;
	
	@Autowired
	public MyDataRestConfig(EntityManager theEntityManager) {
		this.entityManager = theEntityManager;
	}
	
	@Override
	public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {

		HttpMethod[] unsupportedActions = { HttpMethod.PUT, HttpMethod.DELETE, HttpMethod.POST };
		
		disableHttpMethods(Product.class,config, unsupportedActions);
		disableHttpMethods(ProductCategory.class,config, unsupportedActions);
		disableHttpMethods(Country.class,config, unsupportedActions);
		disableHttpMethods(State.class,config, unsupportedActions);
		
	
		exposeIds(config);
	}

	private void disableHttpMethods(Class theClass,RepositoryRestConfiguration config, HttpMethod[] unsupportedActions) {
		// Disable the http methods for product category put post delete.
		config.getExposureConfiguration().forDomainType(theClass)
				.withItemExposure((metadata, httpMethods) -> httpMethods.disable(unsupportedActions))
				.withCollectionExposure((metadata, httpMethods) -> httpMethods.disable(unsupportedActions));
	}
	
	private void exposeIds(RepositoryRestConfiguration config) {
		Set<EntityType<?>> entities =   entityManager.getMetamodel().getEntities();
		
		List<Class> entityClasses  = new ArrayList<>();
		for (EntityType tempEntitiy : entities) {
			entityClasses.add(tempEntitiy.getJavaType());
			
		}
		Class[]  domainTypes = entityClasses.toArray(new Class[0]);
		config.exposeIdsFor(domainTypes);
		
	}

}
