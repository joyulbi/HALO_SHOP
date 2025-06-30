package com.company.haloshop.userpoint;

import com.company.haloshop.dto.shop.UserPointDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserPointService {

    private final UserPointMapper userPointMapper;

    public List<UserPointDto> findAll() {
        return userPointMapper.findAll();
    }

    public UserPointDto findById(Long id) {
        return userPointMapper.findById(id);
    }

    public void insert(UserPointDto userPoint) {
        userPointMapper.insert(userPoint);
    }

    public void update(UserPointDto userPoint) {
        userPointMapper.update(userPoint);
    }

    public void delete(Long id) {
        userPointMapper.delete(id);
    }
}
