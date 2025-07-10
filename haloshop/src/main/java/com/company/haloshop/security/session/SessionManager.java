package com.company.haloshop.security.session;

import javax.servlet.http.HttpSession;
import java.util.concurrent.ConcurrentHashMap;

public class SessionManager {
    private static final ConcurrentHashMap<Long, HttpSession> sessionStore = new ConcurrentHashMap<>();

    public static boolean registerSession(Long accountId, HttpSession newSession) {
        return sessionStore.putIfAbsent(accountId, newSession) == null;
    }

    public static void removeSession(Long accountId) {
        HttpSession session = sessionStore.remove(accountId);
        if (session != null) {
            session.invalidate();
        }
    }

    public static HttpSession getSession(Long accountId) {
        return sessionStore.get(accountId);
    }

    public static boolean hasSession(Long accountId) {
        return sessionStore.containsKey(accountId);
    }
}
