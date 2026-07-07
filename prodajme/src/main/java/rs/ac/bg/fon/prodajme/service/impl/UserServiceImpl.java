package rs.ac.bg.fon.prodajme.service.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import rs.ac.bg.fon.prodajme.entity.City;
import rs.ac.bg.fon.prodajme.entity.User;
import rs.ac.bg.fon.prodajme.enums.UserRole;
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
    private static final String PHONE_FORMAT_MESSAGE = "Neispravan format telefona. Format mora biti +381XXXXXXXX.";
    private static final String PASSWORD_POLICY_MESSAGE = "Lozinka mora imati najmanje 7 karaktera, najmanje jedno veliko slovo i najmanje jedan broj.";
    private static final String EMAIL_EXISTS_MESSAGE = "Korisnik sa ovom email adresom već postoji.";
    private static final String USERNAME_EXISTS_MESSAGE = "Korisničko ime je već zauzeto.";
    private static final String PHONE_EXISTS_MESSAGE = "Telefon je već registrovan.";

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
                .orElseThrow(() -> new ResourceNotFoundException("Korisnik nije pronađen."));
    }

    @Override
    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Korisnik nije pronađen."));
    }

    @Override
    public User login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("Neispravan email ili lozinka."));

        boolean passwordMatches = passwordEncoder.matches(password, user.getPassword());

        //Ako u bazi postoji lozinka koja nije enkriptovana
        if (!passwordMatches && password.equals(user.getPassword())) {
            user.setPassword(passwordEncoder.encode(password));
            userRepository.save(user);
            passwordMatches = true;
        }

        if (!passwordMatches) {
            throw new BadRequestException("Neispravan email ili lozinka.");
        }

        if (!Boolean.TRUE.equals(user.getEnabled())) {
            throw new BadRequestException("Email nije verifikovan.");
        }

        return user;
    }

    @Override
    public User verifyEmail(String email, String code) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("Neispravan email ili kod."));

        if (user.getVerificationCode() == null || !user.getVerificationCode().equals(code)) {
            throw new BadRequestException("Neispravan email ili kod.");
        }

        user.setEnabled(true);
        user.setVerificationCode(null);
        return userRepository.save(user);
    }

    @Override
    public void forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("Korisnik sa ovim email-om ne postoji."));

        String resetPasswordCode = String.valueOf(ThreadLocalRandom.current().nextInt(100000, 1000000));
        user.setResetPasswordCode(resetPasswordCode);
        userRepository.save(user);

        mailService.sendResetPasswordEmail(user.getEmail(), user.getName(), resetPasswordCode);
    }

    @Override
    public void resetPassword(String email, String code, String newPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("Neispravan kod za resetovanje lozinke."));

        if (user.getResetPasswordCode() == null || !user.getResetPasswordCode().equals(code)) {
            throw new BadRequestException("Neispravan kod za resetovanje lozinke.");
        }

        validatePassword(newPassword);
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetPasswordCode(null);
        userRepository.save(user);
    }

    @Override
    public User register(User user) {
        if (user.getCity() == null || user.getCity().getId() == null) {
            throw new ResourceNotFoundException("Grad nije pronađen.");
        }

        return register(user, user.getCity().getId());
    }

    @Override
    public User register(User user, Integer cityId) {
        validatePhone(user.getPhone());
        validatePassword(user.getPassword());

        if (userRepository.existsByUsername(user.getUsername())) {
            throw new BadRequestException(USERNAME_EXISTS_MESSAGE);
        }

        if (userRepository.existsByEmail(user.getEmail())) {
            throw new BadRequestException(EMAIL_EXISTS_MESSAGE);
        }

        if (userRepository.existsByPhone(user.getPhone())) {
            throw new BadRequestException(PHONE_EXISTS_MESSAGE);
        }

        City city = cityRepository.findById(cityId)
                .orElseThrow(() -> new ResourceNotFoundException("Grad nije pronađen."));

        String verificationCode = String.valueOf(ThreadLocalRandom.current().nextInt(100000, 1000000));

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setVerificationCode(verificationCode);
        user.setEnabled(false);
        user.setRole(user.getRole() == null ? UserRole.USER : user.getRole());
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
        validatePhone(user.getPhone());

        if (user.getEmail() != null && !user.getEmail().isBlank()
                && !user.getEmail().equalsIgnoreCase(existingUser.getEmail())
                && userRepository.existsByEmail(user.getEmail())) {
            throw new BadRequestException(EMAIL_EXISTS_MESSAGE);
        }

        if (user.getUsername() != null && !user.getUsername().isBlank()
                && !user.getUsername().equals(existingUser.getUsername())
                && userRepository.existsByUsername(user.getUsername())) {
            throw new BadRequestException(USERNAME_EXISTS_MESSAGE);
        }

        if (user.getPhone() != null && !user.getPhone().isBlank()
                && !user.getPhone().equals(existingUser.getPhone())
                && userRepository.existsByPhone(user.getPhone())) {
            throw new BadRequestException(PHONE_EXISTS_MESSAGE);
        }

        City city = cityRepository.findById(cityId)
            .orElseThrow(() -> new ResourceNotFoundException("Grad nije pronađen."));

        existingUser.setName(user.getName());
        existingUser.setSurname(user.getSurname());
        existingUser.setPhone(user.getPhone());
        existingUser.setEmail(user.getEmail());
        existingUser.setUsername(user.getUsername());
        if (user.getPassword() != null) {
            existingUser.setPassword(user.getPassword());
        }
        if (user.getRole() != null) {
            existingUser.setRole(user.getRole());
        }
        existingUser.setCity(city);

        return userRepository.save(existingUser);
    }

    @Override
    public void delete(Integer id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("Korisnik nije pronađen.");
        }
        userRepository.deleteById(id);
    }

    private void validatePhone(String phone) {
        if (phone == null || !phone.trim().matches("^\\+381\\d{8,9}$")) {
            throw new BadRequestException(PHONE_FORMAT_MESSAGE);
        }
    }

    private void validatePassword(String password) {
        if (password == null || password.length() < 7 || !password.matches(".*[A-Z].*") || !password.matches(".*\\d.*")) {
            throw new BadRequestException(PASSWORD_POLICY_MESSAGE);
        }
    }
}
