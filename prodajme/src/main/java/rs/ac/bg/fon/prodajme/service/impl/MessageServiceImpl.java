package rs.ac.bg.fon.prodajme.service.impl;

import org.springframework.stereotype.Service;
import rs.ac.bg.fon.prodajme.entity.Message;
import rs.ac.bg.fon.prodajme.entity.Product;
import rs.ac.bg.fon.prodajme.entity.User;
import rs.ac.bg.fon.prodajme.repository.MessageRepository;
import rs.ac.bg.fon.prodajme.repository.ProductRepository;
import rs.ac.bg.fon.prodajme.repository.UserRepository;
import rs.ac.bg.fon.prodajme.service.MessageService;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MessageServiceImpl implements MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public MessageServiceImpl(MessageRepository messageRepository,
                              UserRepository userRepository,
                              ProductRepository productRepository) {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    @Override
    public List<Message> findReceivedMessages(Integer receiverId) {
        if (!userRepository.existsById(receiverId)) {
            throw new RuntimeException("User not found");
        }
        return messageRepository.findByReceiverId(receiverId);
    }

    @Override
    public List<Message> findSentMessages(Integer senderId) {
        if (!userRepository.existsById(senderId)) {
            throw new RuntimeException("User not found");
        }
        return messageRepository.findBySenderId(senderId);
    }

    @Override
    public Message sendMessage(Integer senderId, Integer receiverId, Integer productId, String text) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Message message = new Message();
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setProduct(product);
        message.setText(text);
        message.setDateSent(LocalDateTime.now());

        return messageRepository.save(message);
    }
}
