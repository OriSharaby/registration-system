import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  startChat,
  sendChatMessage,
  type ChatMessage,
} from "../services/chatApi";

export default function ChatScreen() {
  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isStartingChat, setIsStartingChat] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [error, setError] = useState("");

  const flatListRef = useRef<FlatList<ChatMessage>>(null);

  const handleStartChat = async () => {
    if (!customerName.trim() || !phoneNumber.trim()) {
      setError("Please enter your name and phone number");
      return;
    }

    setError("");
    setIsStartingChat(true);

    try {
      const result = await startChat({
        customerName: customerName.trim(),
        phoneNumber: phoneNumber.trim(),
        channel: "mobile",
      });

      setConversationId(result.conversationId);
      setMessages(result.messages);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to start chat";
      setError(message);
    } finally {
      setIsStartingChat(false);
    }
  };

  const handleSendMessage = async () => {
    if (!conversationId || !currentMessage.trim()) return;

    setError("");
    setIsSendingMessage(true);

    try {
      const result = await sendChatMessage({
        conversationId,
        message: currentMessage.trim(),
      });

      setMessages(result.messages);
      setCurrentMessage("");

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to send message";
      setError(message);
    } finally {
      setIsSendingMessage(false);
    }
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isUser = item.role === "user";

    return (
      <View
        style={[
          styles.messageRow,
          isUser ? styles.messageRowUser : styles.messageRowAssistant,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            isUser ? styles.userBubble : styles.assistantBubble,
          ]}
        >
          <Text style={isUser ? styles.userText : styles.assistantText}>
            {item.content}
          </Text>
        </View>
      </View>
    );
  };

  if (!conversationId) {
    return (
      <View style={styles.screen}>
        <View style={styles.startCard}>
          <Text style={styles.title}>A.B Deliveries Assistant</Text>
          <Text style={styles.subtitle}>
            Enter a few details and start chatting
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Name"
            value={customerName}
            onChangeText={setCustomerName}
            placeholderTextColor="#9aa3bf"
          />

          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholderTextColor="#9aa3bf"
          />

          {!!error && <Text style={styles.error}>{error}</Text>}

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleStartChat}
            disabled={isStartingChat}
          >
            <Text style={styles.primaryButtonText}>
              {isStartingChat ? "Starting..." : "Start Chat"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.chatShell}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>A.B Deliveries Assistant</Text>
          <Text style={styles.headerSubtitle}>Online now</Text>
        </View>

        {!!error && <Text style={styles.errorInline}>{error}</Text>}

        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(_, index) => `msg-${index}`}
          renderItem={renderMessage}
          contentContainerStyle={styles.messagesContainer}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
        />

        <View style={styles.composer}>
          <TextInput
            style={styles.composerInput}
            placeholder="Type your message..."
            value={currentMessage}
            onChangeText={setCurrentMessage}
            placeholderTextColor="#9aa3bf"
          />

          <TouchableOpacity
            style={[
              styles.sendButton,
              (!currentMessage.trim() || isSendingMessage) &&
                styles.sendButtonDisabled,
            ]}
            onPress={handleSendMessage}
            disabled={!currentMessage.trim() || isSendingMessage}
          >
            <Text style={styles.sendButtonText}>
              {isSendingMessage ? "..." : "Send"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#5f73d6",
    padding: 16,
    justifyContent: "center",
  },
  startCard: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#5769d4",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#97a0bb",
    marginBottom: 20,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#e6e9f5",
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 12,
    backgroundColor: "#fff",
    color: "#2f3553",
  },
  primaryButton: {
    height: 46,
    borderRadius: 999,
    backgroundColor: "#5769d4",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  error: {
    color: "#c62828",
    marginBottom: 10,
  },
  chatShell: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 24,
    overflow: "hidden",
  },
  header: {
    backgroundColor: "#4354c8",
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  headerTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "700",
  },
  headerSubtitle: {
    color: "#e6e9ff",
    fontSize: 13,
    marginTop: 4,
  },
  errorInline: {
    color: "#c62828",
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  messagesContainer: {
    padding: 16,
    gap: 12,
  },
  messageRow: {
    flexDirection: "row",
  },
  messageRowAssistant: {
    justifyContent: "flex-start",
  },
  messageRowUser: {
    justifyContent: "flex-end",
  },
  messageBubble: {
    maxWidth: "80%",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },
  assistantBubble: {
    backgroundColor: "#eef2ff",
    borderBottomLeftRadius: 8,
  },
  userBubble: {
    backgroundColor: "#5769d4",
    borderBottomRightRadius: 8,
  },
  assistantText: {
    color: "#2f3553",
    fontSize: 15,
    lineHeight: 21,
  },
  userText: {
    color: "#ffffff",
    fontSize: 15,
    lineHeight: 21,
  },
  composer: {
    flexDirection: "row",
    padding: 14,
    borderTopWidth: 1,
    borderTopColor: "#e6e9f5",
    gap: 10,
  },
  composerInput: {
    flex: 1,
    height: 46,
    borderWidth: 1,
    borderColor: "#e6e9f5",
    borderRadius: 999,
    paddingHorizontal: 16,
    color: "#2f3553",
    backgroundColor: "#fff",
  },
  sendButton: {
    minWidth: 84,
    height: 46,
    borderRadius: 999,
    backgroundColor: "#5769d4",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  sendButtonDisabled: {
    opacity: 0.6,
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "700",
  },
});