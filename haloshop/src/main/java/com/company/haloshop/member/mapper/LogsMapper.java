package com.company.haloshop.member.mapper;

import com.company.haloshop.dto.member.LogsDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface LogsMapper {

    LogsDto selectById(@Param("id") Long id);

    List<LogsDto> selectAll();

    int insertLog(LogsDto log);

    int updateLog(LogsDto log);

    int deleteById(@Param("id") Long id);
}
