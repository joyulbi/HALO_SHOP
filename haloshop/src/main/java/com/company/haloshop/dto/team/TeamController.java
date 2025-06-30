package com.company.haloshop.dto.team;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/teams")
@RequiredArgsConstructor
public class TeamController {
	
	private final TeamService teamService;
	
	// 전체 팀 조회
	@GetMapping
	public ResponseEntity<List<TeamResponseDto>> getAllTeams() {
		List<TeamResponseDto> teams = teamService.findAll();
		return ResponseEntity.ok(teams);
	}

	// 단일 팀 조회
	@GetMapping("/{id}")
	public ResponseEntity<TeamResponseDto> getTeamById(@PathVariable Long id) {
		TeamResponseDto team = teamService.findById(id);
		return ResponseEntity.ok(team);
	}
	
	// 팀 생성
	@PostMapping
	public ResponseEntity<TeamResponseDto> createTeam(@RequestBody TeamRequestDto requestDto) {
		TeamResponseDto createdTeam = teamService.createTeam(requestDto);
		return ResponseEntity.ok(createdTeam);
	}
	
	// 팀 수정
	@PatchMapping("/{id}")
	public ResponseEntity<TeamResponseDto> updatedTeam(
			@PathVariable Long id,
			@RequestBody TeamRequestDto requestDto) {
		TeamResponseDto updatedTeam = teamService.updateTeam(id, requestDto);
		return ResponseEntity.ok(updatedTeam);
	}
}
