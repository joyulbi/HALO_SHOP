package com.company.haloshop.membership;

import com.company.haloshop.dto.shop.MembershipDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MembershipService {

    private final MembershipMapper membershipMapper;

    public List<MembershipDto> findAll() {
        return membershipMapper.findAll();
    }

    public MembershipDto findById(Integer id) {
        return membershipMapper.findById(id);
    }

    public void insert(MembershipDto dto) {
        membershipMapper.insert(dto);
    }

    public void update(MembershipDto dto) {
        membershipMapper.update(dto);
    }

    public void delete(Integer id) {
        membershipMapper.delete(id);
    }
}


/*package com.company.haloshop.membership;


import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class MembershipService {

    private final MembershipMapper membershipMapper;

    public MembershipService(MembershipMapper membershipMapper) {
        this.membershipMapper = membershipMapper;
    }

    public List<Membership> findAll() {
        return membershipMapper.findAll();
    }

    public Membership findById(Integer id) {
        return membershipMapper.findById(id);
    }

    public void insert(Membership dto) {
        membershipMapper.insert(dto);
    }

    public void update(Membership dto) {
        membershipMapper.update(dto);
    }

    public void delete(Integer id) {
        membershipMapper.delete(id);
    }
}
*/