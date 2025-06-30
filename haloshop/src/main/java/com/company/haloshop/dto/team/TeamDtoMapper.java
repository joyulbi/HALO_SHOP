package com.company.haloshop.dto.team;

import com.company.haloshop.team.Team;

public class TeamDtoMapper {

    public static TeamResponseDto toDto(Team team) {
        if (team == null) return null;
        return TeamResponseDto.builder()
            .id(team.getId())
            .name(team.getName())
            .active(team.getActive())
            .build();
    }

    public static Team toEntity(TeamRequestDto dto) {
        if (dto == null) return null;
        return Team.builder()
            .name(dto.getName())
            .active(dto.getActive() != null ? dto.getActive() : true) // 기본값 true
            .build();
    }
}