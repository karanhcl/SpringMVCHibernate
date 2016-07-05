package com.journaldev.spring.dao;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.journaldev.spring.model.Person;

@Repository
public class PersonDAOImpl implements PersonDAO {
	
	private static final Logger logger = LoggerFactory.getLogger(PersonDAOImpl.class);
  
	@Autowired
	private SessionFactory ob2;
	
	/*public void setsessionFactory1(sessionFactory1 sf){
		this.sessionFactory1 = sf;
	}*/
//add person
	@Override
	public void addPerson(Person p) {
		Session session = this.ob2.getCurrentSession();
	   session.beginTransaction();
	   session.persist(p);
	   session.getTransaction().commit();
		logger.info("Person saved successfully, Person Details="+p);
	}

	

	@Override
	public void updatePerson(Person p) {
		Session session = this.ob2.getCurrentSession();
		session.update(p);
		logger.info("Person updated successfully, Person Details="+p);
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<Person> listPersons() {
		Session session = this.ob2.getCurrentSession();
		session.beginTransaction();
		List<Person> personsList = session.createQuery("from Person where id = :id").setParameter("id",2).list();
		for(Person p : personsList){
			logger.info("Person List::"+p);
		}
		   session.getTransaction().commit();
		return personsList;
	}

	@Override
	public Person getPersonById(int id) {
		Session session = this.ob2.getCurrentSession();		
		Person p = (Person) session.get(Person.class, new Integer(id));
	
		Criteria cr = session.createCriteria(Person.class);
		cr.add(Restrictions.ilike("name", "%e%"));
		cr.setProjection( Projections.rowCount());
		List list = cr.addOrder(Order.desc("id")).list();
		System.out.println(list);
		logger.info("Person loaded successfully, Person details="+p);
		return p;
	}

	@Override
	public void removePerson(int id) {
		Session session = this.ob2.getCurrentSession();
		Person p = (Person) session.load(Person.class, new Integer(id));
		if(null != p){
			session.delete(p);
		}
		logger.info("Person deleted successfully, person details="+p);
	}

}
