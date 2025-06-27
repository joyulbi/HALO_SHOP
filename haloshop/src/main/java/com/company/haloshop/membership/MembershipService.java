package com.company.haloshop.membership;


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
