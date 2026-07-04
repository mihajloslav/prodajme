package rs.ac.bg.fon.prodajme.service;

import rs.ac.bg.fon.prodajme.entity.User;

import java.util.List;

public interface UserService {

    List<User> findAll();

    User findById(Integer id);

    User findByUsername(String username);

    User register(User user);
}
