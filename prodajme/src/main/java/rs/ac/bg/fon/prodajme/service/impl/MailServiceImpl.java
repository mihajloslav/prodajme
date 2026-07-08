package rs.ac.bg.fon.prodajme.service.impl;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.MimeMessageHelper;
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

    @Override
    public void sendResetPasswordEmail(String to, String name, String code) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Reset lozinke za ProdajMe");
        message.setText("Pozdrav " + name + ",\nVaš kod za reset lozinke na platformi ProdajMe je: " + code);
        mailSender.send(message);
    }

    @Override
    public void sendAdsReportEmail(String to, String fileName, byte[] reportBytes) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(to);
            helper.setSubject("Izveštaj oglasa za ProdajMe");
            helper.setText("U prilogu se nalazi izveštaj sa svim Vašim oglasima.");
            helper.addAttachment(fileName, new ByteArrayResource(reportBytes));
            mailSender.send(message);
        } catch (MessagingException ex) {
            throw new IllegalStateException("Slanje izveštaja mejlom nije uspelo.", ex);
        }
    }
}
