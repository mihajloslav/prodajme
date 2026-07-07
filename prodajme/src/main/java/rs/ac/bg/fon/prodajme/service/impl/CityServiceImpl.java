package rs.ac.bg.fon.prodajme.service.impl;

import org.springframework.stereotype.Service;
import rs.ac.bg.fon.prodajme.entity.City;
import rs.ac.bg.fon.prodajme.exception.ResourceNotFoundException;
import rs.ac.bg.fon.prodajme.repository.CityRepository;
import rs.ac.bg.fon.prodajme.service.CityService;

import java.util.List;

@Service
public class CityServiceImpl implements CityService {

    private final CityRepository cityRepository;

    public CityServiceImpl(CityRepository cityRepository) {
        this.cityRepository = cityRepository;
    }

    @Override
    public List<City> findAll() {
        return cityRepository.findAll();
    }

    @Override
    public City findById(Integer id) {
        return cityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Grad nije pronađen."));
    }
}
