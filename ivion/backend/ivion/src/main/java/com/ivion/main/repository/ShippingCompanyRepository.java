package com.ivion.main.repository;

import com.ivion.main.entity.ShippingCompany;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShippingCompanyRepository extends JpaRepository<ShippingCompany, Integer> {
}