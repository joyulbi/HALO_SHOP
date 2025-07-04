package com.company.haloshop.campaignimage;

import java.awt.Graphics2D;
import java.awt.Image;
import java.awt.RenderingHints;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import javax.imageio.ImageIO;
import javax.servlet.ServletContext;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CampaignImageUploadService {

    private final CampaignImageMapper campaignImageMapper;
    private final ServletContext servletContext;

    private String getUploadDir() {
        // 웹 루트 기준 실제 경로 반환
        return servletContext.getRealPath("/image/campaign/");
    }

    @Transactional
    public String uploadAndSaveImage(Long seasonId, MultipartFile file, int level) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("파일이 비어있습니다.");
        }

        String uploadDir = getUploadDir();

        File dir = new File(uploadDir);
        if (!dir.exists()) {
            dir.mkdirs();
        }

        String originalFilename = file.getOriginalFilename();
        String extension = "";

        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }

        if (extension.isEmpty()) {
            throw new IllegalArgumentException("확장자를 알 수 없는 파일입니다.");
        }

        String savedFileName = java.util.UUID.randomUUID().toString() + extension;
        Path newFilePath = Paths.get(uploadDir, savedFileName);

        // 기존 이미지 정보 조회
        CampaignImage existing = campaignImageMapper.selectCampaignImageBySeasonId(seasonId);
        String oldFileName = null;

        if (existing != null) {
            switch (level) {
                case 1:
                    oldFileName = existing.getLevel_1();
                    break;
                case 2:
                    oldFileName = existing.getLevel_2();
                    break;
                case 3:
                    oldFileName = existing.getLevel_3();
                    break;
                default:
                    throw new IllegalArgumentException("level 값은 1, 2, 3만 가능합니다.");
            }
        }

        // 새 이미지 저장 (리사이징 + 여백추가)
        try (InputStream is = file.getInputStream()) {
            BufferedImage originalImage = ImageIO.read(is);
            int originalWidth = originalImage.getWidth();
            int originalHeight = originalImage.getHeight();

            int canvasSize = 300;   // 최종 이미지 크기
            int resizedSize = 250;  // 리사이징 목표 크기

            // 비율 유지하며 축소
            float scale = Math.min((float)resizedSize / originalWidth, (float)resizedSize / originalHeight);
            int scaledWidth = Math.round(originalWidth * scale);
            int scaledHeight = Math.round(originalHeight * scale);

            Image resizedImage = originalImage.getScaledInstance(scaledWidth, scaledHeight, Image.SCALE_SMOOTH);

            // 300x300 투명 배경 캔버스 생성 (PNG)
            BufferedImage canvas = new BufferedImage(canvasSize, canvasSize, BufferedImage.TYPE_INT_ARGB);
            Graphics2D g = canvas.createGraphics();

            g.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

            // 둥근 클리핑 마스크 (원형)
            g.setClip(new java.awt.geom.Ellipse2D.Float(0, 0, canvasSize, canvasSize));

            // 중앙 배치 좌표
            int x = (canvasSize - scaledWidth) / 2;
            int y = (canvasSize - scaledHeight) / 2;

            g.drawImage(resizedImage, x, y, null);
            g.dispose();

            ImageIO.write(canvas, "png", newFilePath.toFile());
        }

        // DB 업데이트
        CampaignImage updateTarget = new CampaignImage();
        updateTarget.setSeasonId(seasonId);
        switch (level) {
            case 1:
                updateTarget.setLevel_1(savedFileName);
                break;
            case 2:
                updateTarget.setLevel_2(savedFileName);
                break;
            case 3:
                updateTarget.setLevel_3(savedFileName);
                break;
            default:
                throw new IllegalArgumentException("level 값은 1, 2, 3만 가능합니다.");
        }

        int updatedRows = campaignImageMapper.updateCampaignImage(updateTarget);

        if (updatedRows == 0) {
            Files.deleteIfExists(newFilePath); // 실패 시 새 파일 삭제
            throw new IllegalArgumentException("해당 시즌 ID에 대한 campaign_image 레코드를 찾을 수 없습니다.");
        }

        // 기존 이미지 삭제
        if (oldFileName != null && !oldFileName.isBlank()) {
            Path oldFilePath = Paths.get(uploadDir, oldFileName);
            Files.deleteIfExists(oldFilePath);
        }

        return savedFileName;
    }
}
