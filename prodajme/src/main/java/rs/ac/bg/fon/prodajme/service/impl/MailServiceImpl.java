package rs.ac.bg.fon.prodajme.service.impl;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import rs.ac.bg.fon.prodajme.service.MailService;

@Service
public class MailServiceImpl implements MailService {

    private final JavaMailSender mailSender;

    public MailServiceImpl(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Override
    public void sendVerificationEmail(String to, String name, String code) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Dobrodošli na ProdajMe");
        message.setText("Pozdrav " + name + ",\nVaš verifikacioni kod za ProdajMe je: " + code);
        mailSender.send(message);
    }
}
