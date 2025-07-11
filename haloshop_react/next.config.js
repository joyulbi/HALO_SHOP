// next.config.js
module.exports = {
  async rewrites() {
    return [
      // 1) 일반 API
      {
        source: '/api/:path*',
        destination: 'http://localhost:8080/api/:path*',
      },
      // 2) auth / security
      {
        source: '/auth/:path*',
        destination: 'http://localhost:8080/auth/:path*',
      },
      {
        source: '/security/:path*',
        destination: 'http://localhost:8080/security/:path*',
      },

      // ─────────────────────────────────────────────────
      // 3) 백엔드!
      {
        source: '/admin/logs/:path*',       // 하위 경로 포함
        destination: 'http://localhost:8080/admin/logs/:path*',
      },
      {
        source: '/admin/logs',              // /admin/logs (exact) 도
        destination: 'http://localhost:8080/admin/logs',
      },
      // 권한 승격 API 추가
      {
        source: '/admin/promote',
        destination: 'http://localhost:8080/admin/promote', // 백엔드 권한 승격 API
      },
      // ─────────────────────────────────────────────────

      // (주의: **다른** /admin/** 은 프론트에서 처리됩니다)
    ]
  },
}
