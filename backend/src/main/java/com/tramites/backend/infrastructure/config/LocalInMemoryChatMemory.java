package com.tramites.backend.infrastructure.config;

import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.chat.messages.Message;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class LocalInMemoryChatMemory implements ChatMemory {
    private final Map<String, List<Message>> memory = new ConcurrentHashMap<>();

    @Override
    public void add(String conversationId, List<Message> messages) {
        memory.computeIfAbsent(conversationId, k -> new ArrayList<>()).addAll(messages);
    }

    public List<Message> get(String conversationId, int lastN) {
        List<Message> messages = memory.getOrDefault(conversationId, new ArrayList<>());
        if (lastN <= 0 || messages.size() <= lastN) {
            return new ArrayList<>(messages);
        }
        return new ArrayList<>(messages.subList(messages.size() - lastN, messages.size()));
    }

    @Override
    public List<Message> get(String conversationId) {
        return get(conversationId, 100);
    }

    @Override
    public void clear(String conversationId) {
        memory.remove(conversationId);
    }
}
