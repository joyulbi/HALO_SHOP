package com.company.haloshop.season;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface SeasonMapper {

    int insertSeason(Season season);

    List<Season> findAllSeason();

    Season findById(Long id);

    int updateSeason(Season season);

    int deleteSeason(Long id);
}
