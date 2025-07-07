package com.company.haloshop.security.middleware;

import javax.servlet.ReadListener;
import javax.servlet.ServletInputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;
import java.io.*;

/**
 * 요청 본문을 한 번 읽어 내부에 저장한 뒤, 이후 getInputStream()/getReader() 호출 시
 * 캐시된 바디를 재사용할 수 있도록 해 주는 래퍼 클래스
 */
public class CachedBodyHttpServletRequest extends HttpServletRequestWrapper {

    private final byte[] cachedBody;

    public CachedBodyHttpServletRequest(HttpServletRequest request) throws IOException {
        super(request);
        try (InputStream is = request.getInputStream()) {
            this.cachedBody = is.readAllBytes();
        }
    }

    @Override
    public ServletInputStream getInputStream() {
        final ByteArrayInputStream bais = new ByteArrayInputStream(cachedBody);
        return new ServletInputStream() {
            @Override public boolean isFinished() { return bais.available() == 0; }
            @Override public boolean isReady() { return true; }
            @Override public void setReadListener(ReadListener listener) { /* no-op */ }
            @Override public int read() throws IOException { return bais.read(); }
        };
    }

    @Override
    public BufferedReader getReader() throws IOException {
        return new BufferedReader(new InputStreamReader(getInputStream()));
    }
}
