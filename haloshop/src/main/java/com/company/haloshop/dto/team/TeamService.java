package com.company.haloshop.dto.team;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.springframework.stereotype.Service;

import com.company.haloshop.team.Team;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TeamService {
	
	private final TeamMapper teamMapper;
	
	// 전체 팀 조회
	public List<TeamResponseDto> findAll() {
		List<Team> teams = teamMapper.findAllTeam();
		return teams.stream()
				.map(TeamDtoMapper::toDto)
				.collect(Collectors.toList());
	}
	
	// 단일 팀 조회
	public TeamResponseDto findById(Long id) {
		Team team = teamMapper.findById(id);
		if (team == null) {
			throw new IllegalArgumentException("TEAM IS NOT EXIST, YOUR SEARCH : "+id);
		}
		return TeamDtoMapper.toDto(team);
	}
	
	@Transactional
	public TeamResponseDto createTeam(TeamRequestDto requestDto) {
		Team team = TeamDtoMapper.toEntity(requestDto);
		teamMapper.insertTeam(team);
		return TeamDtoMapper.toDto(team);
	}
	
	// 팀 수정
	@Transactional
	public TeamResponseDto updateTeam(Long id, TeamRequestDto requestDto) {
		Team find = teamMapper.findById(id);
		if (find == null) {
			throw new IllegalArgumentException("TEAM IS NOT EXIST, YOUR SEARCH : "+id);
		}
		
		Map<String, Object> params = new HashMap<>();
		params.put("id", id);
		
		// 입력받은 항목만 수정
		if (requestDto.getName() != null) {
			params.put("name", requestDto.getName());
		}
		
		if (requestDto.getActive() != null) {
			params.put("active", requestDto.getActive());
		}
		
		int updated = teamMapper.updateTeamSelective(params);
		if (updated == 0) {
			throw new IllegalStateException("UPDATE FAILED, FAILED ID : "+id);
		}
		
		Team updatedTeam = teamMapper.findById(id);
		return TeamDtoMapper.toDto(updatedTeam);
	}
}
