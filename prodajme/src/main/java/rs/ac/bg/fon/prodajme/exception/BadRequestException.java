package rs.ac.bg.fon.prodajme.exception;

public class BadRequestException extends RuntimeException {

    public BadRequestException(String message) {
        super(message);
    }
}
