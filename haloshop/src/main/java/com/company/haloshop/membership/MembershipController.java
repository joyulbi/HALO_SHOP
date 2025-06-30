package com.company.haloshop.membership;

import com.company.haloshop.dto.shop.MembershipDto;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/membership")
@RequiredArgsConstructor
public class MembershipController {

    private final MembershipService membershipService;

    @GetMapping
    public List<MembershipDto> getAllMemberships() {
        return membershipService.findAll();
    }

    @GetMapping("/{id}")
    public MembershipDto getMembership(@PathVariable Integer id) {
        return membershipService.findById(id);
    }

    @PostMapping
    public void createMembership(@RequestBody MembershipDto dto) {
        membershipService.insert(dto);
    }

    @PutMapping("/{id}")
    public void updateMembership(@PathVariable Integer id, @RequestBody MembershipDto dto) {
        dto.setId(id);
        membershipService.update(dto);
    }

    @DeleteMapping("/{id}")
    public void deleteMembership(@PathVariable Integer id) {
        membershipService.delete(id);
    }
}


/*package com.company.haloshop.membership;


import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/membership")
public class MembershipController {

    private final MembershipService membershipService;

    public MembershipController(MembershipService membershipService) {
        this.membershipService = membershipService;
    }

    @GetMapping
    public List<Membership> getAllMemberships() {
        return membershipService.findAll();
    }

    @GetMapping("/{id}")
    public Membership getMembership(@PathVariable Integer id) {
        return membershipService.findById(id);
    }

    @PostMapping
    public void createMembership(@RequestBody Membership dto) {
        membershipService.insert(dto);
    }

    @PutMapping("/{id}")
    public void updateMembership(@PathVariable Integer id, @RequestBody Membership dto) {
        dto.setId(id);
        membershipService.update(dto);
    }

    @DeleteMapping("/{id}")
    public void deleteMembership(@PathVariable Integer id) {
        membershipService.delete(id);
    }
}
*/