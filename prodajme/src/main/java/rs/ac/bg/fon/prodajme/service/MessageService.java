package rs.ac.bg.fon.prodajme.service;

import rs.ac.bg.fon.prodajme.entity.Message;

import java.util.List;

public interface MessageService {

    List<Message> findReceivedMessages(Integer receiverId);

    List<Message> findSentMessages(Integer senderId);

    Message sendMessage(Integer senderId, Integer receiverId, Integer productId, String text);
}
