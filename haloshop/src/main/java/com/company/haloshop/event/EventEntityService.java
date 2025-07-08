package com.company.haloshop.event;

import java.util.List;

import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EventEntityService {
	private final EventEntityMapper eventEntityMapper;
	
	@EventListener(ApplicationReadyEvent.class)
	public void insertEventEntity() {
		List<EventEntity> eventEntities = eventEntityMapper.findAll();
		if(eventEntities == null || eventEntities.isEmpty()) {
			
			// 초기 데이터 삽입
			EventEntity[] type = new EventEntity[] {
					EventEntity.builder().name("테스트").build()
			};
			
			for (EventEntity eventEntity : type) {
				eventEntityMapper.insert(eventEntity);
			}
		}
	}
}
