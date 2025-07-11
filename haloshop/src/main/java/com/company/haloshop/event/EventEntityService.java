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
					// 문의 타입 100(기본)-199
				    EventEntity.builder().id(100L).name("문의").build(),
				    EventEntity.builder().id(101L).name("상품").build(),
				    EventEntity.builder().id(102L).name("경매").build(),
				    EventEntity.builder().id(103L).name("결제").build(),
				    EventEntity.builder().id(104L).name("환불").build(),
				    EventEntity.builder().id(105L).name("배송").build(),
				    EventEntity.builder().id(106L).name("계정").build(),
				    EventEntity.builder().id(107L).name("기타").build(),
				    
				    // 경매 타입 200(기본)-299
				    EventEntity.builder().id(200L).name("경매").build(),
				    EventEntity.builder().id(201L).name("낙찰").build(),
				    EventEntity.builder().id(202L).name("확정").build(),
				    EventEntity.builder().id(203L).name("취소").build(),
				    
				    // 시즌 타입 300(기본)-399
				    EventEntity.builder().id(300L).name("시즌").build(),
				    EventEntity.builder().id(301L).name("생성").build(),
				    
				    // 배송 타입 400(기본)-499
				    EventEntity.builder().id(400L).name("배송").build(),
				    EventEntity.builder().id(401L).name("준비").build(),
				    EventEntity.builder().id(402L).name("시작").build(),
				    EventEntity.builder().id(403L).name("완료").build(),
				    
				    // 결제 타입 (500)-599
				    EventEntity.builder().id(500L).name("결제").build(),
				    EventEntity.builder().id(501L).name("완료").build(),
				    EventEntity.builder().id(502L).name("실패").build(),
				    EventEntity.builder().id(503L).name("등급").build(),
				    				    
				    // 포인트 타입 600-699
				    EventEntity.builder().id(600L).name("포인트").build(),
				    EventEntity.builder().id(601L).name("적립").build(),
				    EventEntity.builder().id(602L).name("사용").build(),
				};
			
			for (EventEntity eventEntity : types) {
				eventEntityMapper.insert(eventEntity);
			}
		}
	}
}
