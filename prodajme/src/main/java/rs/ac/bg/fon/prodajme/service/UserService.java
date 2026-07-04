package rs.ac.bg.fon.prodajme.service;

import rs.ac.bg.fon.prodajme.entity.User;

import java.util.List;

public interface UserService {

    List<User> findAll();

    User findById(Integer id);

    User findByUsername(String username);

    User login(String email, String password);

    User verifyEmail(String email, String code);

    void forgotPassword(String email);

    void resetPassword(String email, String code, String newPassword);

    User register(User user);

    User register(User user, Integer cityId);

    User update(Integer id, User user, Integer cityId);

    void delete(Integer id);
}
