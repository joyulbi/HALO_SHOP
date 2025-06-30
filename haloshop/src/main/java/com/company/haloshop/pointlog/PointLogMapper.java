package com.company.haloshop.pointlog;

import com.company.haloshop.dto.shop.PointLogDto;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;

@Mapper
public interface PointLogMapper {

    List<PointLogDto> findAll();

    PointLogDto findById(Long id);

    void insert(PointLogDto pointLogDto);

    void update(PointLogDto pointLogDto);

    void delete(Long id);
}
