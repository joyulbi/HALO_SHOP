package com.company.haloshop.dto.donate;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.company.haloshop.donate.Season;

@Mapper
public interface SeasonMapper {

    int insertSeason(Season season);

    List<Season> findAllSeason();

    Season findById(Long id);

    int updateSeason(Season season);

    int deleteSeason(Long id);
}
