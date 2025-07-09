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
			EventEntity[] types = new EventEntity[] {
				    EventEntity.builder().id(100L).name("문의").build(),
				    EventEntity.builder().id(101L).name("상품").build(),
				    EventEntity.builder().id(102L).name("경매").build(),
				    EventEntity.builder().id(103L).name("결제").build(),
				    EventEntity.builder().id(104L).name("환불").build(),
				    EventEntity.builder().id(106L).name("배송").build(),
				    EventEntity.builder().id(107L).name("계정").build(),
				    EventEntity.builder().id(108L).name("기타").build()
				};
			
			for (EventEntity eventEntity : types) {
				eventEntityMapper.insert(eventEntity);
			}
		}
	}
}
