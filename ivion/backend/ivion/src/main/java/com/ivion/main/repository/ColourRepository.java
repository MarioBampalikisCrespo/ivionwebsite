package com.ivion.main.repository;

import com.ivion.main.entity.Colour;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ColourRepository extends JpaRepository<Colour, Integer> {
}