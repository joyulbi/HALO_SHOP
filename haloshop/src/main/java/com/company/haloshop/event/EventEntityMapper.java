package com.company.haloshop.event;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface EventEntityMapper {
	int insert(EventEntity eventEntity);
	List<EventEntity> findAll();
	EventEntity findById(Long id);
}
