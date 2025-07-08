package com.company.haloshop.event;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Builder;
import lombok.Data;

@Entity
@Table(name = "event_entity") // DB 테이블 이름
@Data
@Builder
public class EventEntity {

    @Id
    private Long id;

    private String name;
    
    public EventEntity() {}
    
    public EventEntity(Long id, String name) {
        this.id = id;
        this.name = name;
    }

	public EventEntity(Long entityId) {
		// TODO Auto-generated constructor stub
	}
}
