package com.company.haloshop.pointlog;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.company.haloshop.dto.shop.PointLogDto;
import com.company.haloshop.notificationEvent.PointLogCreatedEvent;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PointLogService {

    private final PointLogMapper pointLogMapper;
    // 이벤트 발행
    private final ApplicationEventPublisher eventPublisher;
    
    @Transactional
    public void saveLog(Long userId, String type, int amount) {
        PointLogDto log = new PointLogDto();
        log.setAccountId(userId);
        log.setType(type);
        log.setAmount(amount);
        log.setCreatedAt(LocalDateTime.now());
        pointLogMapper.insert(log);
        // 알림 이벤트 발행
        eventPublisher.publishEvent(new PointLogCreatedEvent(this, log));
    }

    public List<PointLogDto> findAll() {
        return pointLogMapper.findAll();
    }

    public PointLogDto findById(Long id) {
        return pointLogMapper.findById(id);
    }

    public void insert(PointLogDto pointLogDto) {
        pointLogMapper.insert(pointLogDto);
    }

    public void update(PointLogDto pointLogDto) {
        pointLogMapper.update(pointLogDto);
    }

    public void delete(Long id) {
        pointLogMapper.delete(id);
    }
}
