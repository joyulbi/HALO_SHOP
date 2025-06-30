package com.company.haloshop.event;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class Notification {

    private Long id;

    // 수신자 (account FK)
    private Long receiverId;

    // 대상 엔티티 타입 (entity FK)
    private Long entityId;

    // 대상 테이블 내 구체적인 대상 id (reference_id)
    private Long referenceId;

    // 읽음 처리 (0 = 읽지 않음, 1 = 읽음)
    private Boolean read;

    private LocalDateTime createdAt;

}
