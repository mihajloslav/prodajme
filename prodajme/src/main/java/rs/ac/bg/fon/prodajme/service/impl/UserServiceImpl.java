package rs.ac.bg.fon.prodajme.service.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import rs.ac.bg.fon.prodajme.entity.City;
import rs.ac.bg.fon.prodajme.entity.User;
import rs.ac.bg.fon.prodajme.exception.BadRequestException;
import rs.ac.bg.fon.prodajme.exception.ResourceNotFoundException;
import rs.ac.bg.fon.prodajme.repository.CityRepository;
import rs.ac.bg.fon.prodajme.repository.UserRepository;
import rs.ac.bg.fon.prodajme.service.MailService;
import rs.ac.bg.fon.prodajme.service.UserService;

import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class UserServiceImpl implements UserService {

    private static final Logger log = LoggerFactory.getLogger(UserServiceImpl.class);

    private final UserRepository userRepository;
    private final CityRepository cityRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final MailService mailService;

    public UserServiceImpl(UserRepository userRepository,
                           CityRepository cityRepository,
                           BCryptPasswordEncoder passwordEncoder,
                           MailService mailService) {
        this.userRepository = userRepository;
        this.cityRepository = cityRepository;
        this.passwordEncoder = passwordEncoder;
        this.mailService = mailService;
    }

    @Override
    public List<User> findAll() {
        return userRepository.findAll();
    }

    @Override
    public User findById(Integer id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @Override
    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @Override
    public User login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("Invalid email or password"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new BadRequestException("Invalid email or password");
        }

        if (!Boolean.TRUE.equals(user.getEnabled())) {
            throw new BadRequestException("Email is not verified");
        }

        return user;
    }

    @Override
    public User verifyEmail(String email, String code) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("Invalid email or code"));

        if (user.getVerificationCode() == null || !user.getVerificationCode().equals(code)) {
            throw new BadRequestException("Invalid email or code");
        }

        user.setEnabled(true);
        user.setVerificationCode(null);
        return userRepository.save(user);
    }

    @Override
    public User register(User user) {
        if (user.getCity() == null || user.getCity().getId() == null) {
            throw new ResourceNotFoundException("City not found");
        }

        return register(user, user.getCity().getId());
    }

    @Override
    public User register(User user, Integer cityId) {
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new BadRequestException("Username already exists");
        }

        if (userRepository.existsByEmail(user.getEmail())) {
            throw new BadRequestException("Email already exists");
        }

        City city = cityRepository.findById(cityId)
                .orElseThrow(() -> new ResourceNotFoundException("City not found"));

        String verificationCode = String.valueOf(ThreadLocalRandom.current().nextInt(100000, 1000000));

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setVerificationCode(verificationCode);
        user.setEnabled(false);
        user.setCity(city);
        User savedUser = userRepository.save(user);

        try {
            mailService.sendVerificationEmail(savedUser.getEmail(), savedUser.getName(), savedUser.getVerificationCode());
        } catch (Exception ex) {
            log.warn("Failed to send verification email to {}: {}", savedUser.getEmail(), ex.getMessage());
        }

        return savedUser;
    }

    @Override
    public User update(Integer id, User user, Integer cityId) {
        User existingUser = findById(id);
        City city = cityRepository.findById(cityId)
            .orElseThrow(() -> new ResourceNotFoundException("City not found"));

        existingUser.setName(user.getName());
        existingUser.setSurname(user.getSurname());
        existingUser.setPhone(user.getPhone());
        existingUser.setEmail(user.getEmail());
        existingUser.setUsername(user.getUsername());
        if (user.getPassword() != null) {
            existingUser.setPassword(user.getPassword());
        }
        existingUser.setRole(user.getRole());
        existingUser.setCity(city);

        return userRepository.save(existingUser);
    }

    @Override
    public void delete(Integer id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found");
        }
        userRepository.deleteById(id);
    }
}
