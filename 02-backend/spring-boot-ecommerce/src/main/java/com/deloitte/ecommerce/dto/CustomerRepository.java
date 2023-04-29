package com.deloitte.ecommerce.dto;

import org.springframework.data.jpa.repository.JpaRepository;

import com.deloitte.ecommerce.entity.Customer;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
}
