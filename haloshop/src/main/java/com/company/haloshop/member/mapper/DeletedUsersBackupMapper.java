package com.company.haloshop.member.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.company.haloshop.dto.member.DeletedUsersBackupDto;

/**
 * deleted_users_backup 테이블 관련 DB 접근 매퍼 인터페이스
 */
@Mapper
public interface DeletedUsersBackupMapper {

    /**
     * account_id로 deleted_users_backup 조회
     * @param accountId 조회할 account ID
     * @return DeletedUsersBackupDto 객체
     */
    DeletedUsersBackupDto selectByAccountId(@Param("accountId") Long accountId);

    /**
     * 모든 deleted_users_backup 목록 조회
     * @return DeletedUsersBackupDto 리스트
     */
    List<DeletedUsersBackupDto> selectAll();

    /**
     * deleted_users_backup 데이터 삽입
     * @param backup 삽입할 DeletedUsersBackupDto 객체
     * @return 삽입 성공 행 개수
     */
    int insertDeletedUsersBackup(DeletedUsersBackupDto backup);

    /**
     * deleted_users_backup 데이터 수정
     * @param backup 수정할 DeletedUsersBackupDto 객체
     * @return 수정 성공 행 개수
     */
    int updateDeletedUsersBackup(DeletedUsersBackupDto backup);

    /**
     * account_id 기준 deleted_users_backup 삭제
     * @param accountId 삭제할 account ID
     * @return 삭제 성공 행 개수
     */
    int deleteByAccountId(@Param("accountId") Long accountId);
}
