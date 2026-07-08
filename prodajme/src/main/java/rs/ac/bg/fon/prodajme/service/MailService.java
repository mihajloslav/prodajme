package rs.ac.bg.fon.prodajme.service;

public interface MailService {

    void sendVerificationEmail(String to, String name, String code);

    void sendResetPasswordEmail(String to, String name, String code);

    void sendAdsReportEmail(String to, String fileName, byte[] reportBytes);
}
