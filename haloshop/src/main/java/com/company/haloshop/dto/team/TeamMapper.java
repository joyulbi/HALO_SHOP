package com.company.haloshop.dto.team;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.company.haloshop.team.Team;

@Mapper
public interface TeamMapper {

	// 전체 팀 조회
	List<Team> findAllTeam();
	
	// id로 팀 조회
	Team findById(Long id);
	
    // 팀 생성
    int insertTeam(Team team);
    
    // 변경 업데이트
    int updateTeamSelective(Map<String, Object> params);
}
