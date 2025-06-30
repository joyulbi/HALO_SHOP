package com.company.haloshop.pointlog;

import java.util.List;

import org.springframework.stereotype.Service;

import com.company.haloshop.dto.shop.PointLogDto;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PointLogService {

    private final PointLogMapper pointLogMapper;

    public List<PointLogDto> findAll() {
        return pointLogMapper.findAll();
    }

    public PointLogDto findById(Long id) {
        return pointLogMapper.findById(id);
    }

    public void insert(PointLogDto pointLogDto) {
        pointLogMapper.insert(pointLogDto);
    }

    public void update(PointLogDto pointLogDto) {
        pointLogMapper.update(pointLogDto);
    }

    public void delete(Long id) {
        pointLogMapper.delete(id);
    }
}
