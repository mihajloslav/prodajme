package rs.ac.bg.fon.prodajme.service;

import rs.ac.bg.fon.prodajme.entity.City;

import java.util.List;

public interface CityService {

    List<City> findAll();

    City findById(Integer id);
}
