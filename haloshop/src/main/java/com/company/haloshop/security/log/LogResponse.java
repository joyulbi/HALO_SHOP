package com.company.haloshop.security.log;

import java.time.Instant;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class LogResponse {
    private Long   id;
    private String action;
    private String description;
    private String ip;
    private Long   executor;    // 계정 ID
    private Instant timestamp;  // created_at

    // 생성자, getter/setter...
}
