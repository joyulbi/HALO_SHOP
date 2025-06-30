package com.company.haloshop.team;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface TeamMapper {

    // insert 시 자동 생성된 키를 Team 객체의 id에 채워줌
    int insertTeam(Team team);

    // 모든 팀 조회
    List<Team> findAllTeam();

    // id로 팀 조회
    Team findById(Long id);

    // 선택적으로 업데이트 (map 파라미터로 필드명과 값 전달)
    int updateTeamSelective(Map<String, Object> params);
}
