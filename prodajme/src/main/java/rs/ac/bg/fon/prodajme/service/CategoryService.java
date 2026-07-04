package rs.ac.bg.fon.prodajme.service;

import rs.ac.bg.fon.prodajme.entity.Category;

import java.util.List;

public interface CategoryService {

    List<Category> findAll();

    Category findById(Integer id);
}
