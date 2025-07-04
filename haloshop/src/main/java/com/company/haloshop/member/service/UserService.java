package com.company.haloshop.member.service;

import com.company.haloshop.dto.member.AccountDto;
import com.company.haloshop.dto.member.UserDto;
import com.company.haloshop.dto.member.UserUpdateRequest;

public interface UserService {
    AccountDto getAccountById(Long id);
    UserDto getUserByAccountId(Long accountId);
    UpdateResult updateMyInfo(Long principalId, UserUpdateRequest req, String accessToken, String refreshToken);

    // 내부 static class or 파일 분리
    class UpdateResult {
        private final boolean emailChanged;
        private final String newAccessToken;
        private final String newRefreshToken;

        public UpdateResult(boolean emailChanged, String newAccessToken, String newRefreshToken) {
            this.emailChanged = emailChanged;
            this.newAccessToken = newAccessToken;
            this.newRefreshToken = newRefreshToken;
        }
        public boolean isEmailChanged() { return emailChanged; }
        public String getNewAccessToken() { return newAccessToken; }
        public String getNewRefreshToken() { return newRefreshToken; }
    }
}
