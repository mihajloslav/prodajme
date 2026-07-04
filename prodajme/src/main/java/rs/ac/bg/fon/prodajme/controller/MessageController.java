package rs.ac.bg.fon.prodajme.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import rs.ac.bg.fon.prodajme.dto.MessageDto;
import rs.ac.bg.fon.prodajme.mapper.MessageMapper;
import rs.ac.bg.fon.prodajme.response.ApiResponse;
import rs.ac.bg.fon.prodajme.response.ApiResponseFactory;
import rs.ac.bg.fon.prodajme.service.MessageService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @GetMapping("/received/{receiverId}")
    public ResponseEntity<ApiResponse> getReceivedMessages(@PathVariable Integer receiverId) {
        try {
            List<MessageDto> messages = messageService.findReceivedMessages(receiverId)
                    .stream()
                    .map(MessageMapper::toDto)
                    .toList();

            return ResponseEntity.ok(ApiResponseFactory.success("Received messages fetched successfully", Map.of("messages", messages)));
        } catch (RuntimeException ex) {
            return handleException(ex);
        }
    }

    @GetMapping("/sent/{senderId}")
    public ResponseEntity<ApiResponse> getSentMessages(@PathVariable Integer senderId) {
        try {
            List<MessageDto> messages = messageService.findSentMessages(senderId)
                    .stream()
                    .map(MessageMapper::toDto)
                    .toList();

            return ResponseEntity.ok(ApiResponseFactory.success("Sent messages fetched successfully", Map.of("messages", messages)));
        } catch (RuntimeException ex) {
            return handleException(ex);
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse> sendMessage(@RequestBody MessageDto messageDto) {
        try {
            MessageDto savedMessage = MessageMapper.toDto(
                    messageService.sendMessage(
                            messageDto.getSenderId(),
                            messageDto.getReceiverId(),
                            messageDto.getProductId(),
                            messageDto.getText()
                    )
            );

            ApiResponse response = ApiResponseFactory.success("Message sent successfully", Map.of("message", savedMessage));
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException ex) {
            return handleException(ex);
        }
    }

    private ResponseEntity<ApiResponse> handleException(RuntimeException ex) {
        String message = ex.getMessage() != null ? ex.getMessage() : "Unexpected error";

        if (message.toLowerCase().contains("not found")) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponseFactory.error(message, HttpStatus.NOT_FOUND));
        }

        if (message.toLowerCase().contains("already exists")) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(ApiResponseFactory.error(message, HttpStatus.CONFLICT));
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponseFactory.error(message, HttpStatus.BAD_REQUEST));
    }
}
