package com.company.haloshop.season;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.company.haloshop.notificationEvent.SeasonStartEvent;

@Component
public class SeasonScheduler {

    private final SeasonMapper seasonMapper;
    private final ApplicationEventPublisher eventPublisher;

    public SeasonScheduler(SeasonMapper seasonMapper,
                           ApplicationEventPublisher eventPublisher) {
        this.seasonMapper = seasonMapper;
        this.eventPublisher = eventPublisher;
    }
    // 테스트용 1분마다
    //@Scheduled(cron = "0 * * * * *")
    
    // 매일 정각
    @Scheduled(cron = "0 0 0 * * *")    
    public void checkSeasonStart() {
        List<Season> allSeasons = seasonMapper.findAllSeason();
        LocalDate today = LocalDate.now();

        for (Season season : allSeasons) {
            LocalDateTime startDateTime = season.getStartDate(); // 이미 LocalDateTime

            if (startDateTime != null) {
                LocalDate startDate = startDateTime.toLocalDate();

                if (startDate.isEqual(today)) {
                    eventPublisher.publishEvent(new SeasonStartEvent(this, season));
                }
            }
        }
    }

    // java.util.Date -> java.time.LocalDate 변환 헬퍼
    private LocalDate toLocalDate(Date date) {
        return date.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
    }
}
