package rs.ac.bg.fon.prodajme.service;

public interface MailService {

    void sendVerificationEmail(String to, String name, String code);
}
