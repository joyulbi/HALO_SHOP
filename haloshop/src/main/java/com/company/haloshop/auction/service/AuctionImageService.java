package com.company.haloshop.auction.service;

import com.company.haloshop.auction.dto.AuctionImage;
import com.company.haloshop.auction.mapper.AuctionImageMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuctionImageService {

    private final AuctionImageMapper auctionImageMapper;

    // 경매 이미지 전용 저장 경로 (application.properties 불필요)
    private final String uploadDir = "C:/upload/auction/";

    // 이미지 단건 조회
    public AuctionImage getById(Long id) {
        return auctionImageMapper.selectById(id);
    }

    // 특정 경매의 이미지 목록 조회
    public List<AuctionImage> getByAuctionId(Long auctionId) {
        return auctionImageMapper.selectByAuctionId(auctionId);
    }

    // 이미지 정보 수정 (url 필드 값 변경 등)
    public void update(AuctionImage auctionImage) {
        auctionImageMapper.update(auctionImage);
    }

    // 이미지 삭제
    public void delete(Long id) {
        auctionImageMapper.delete(id);
    }

    // 다중 파일 업로드 및 DB등록
    public List<String> saveAuctionImages(Long auctionId, List<MultipartFile> files) {
        // 폴더 없으면 자동 생성 (최초 1회)
        File dir = new File(uploadDir);
        if (!dir.exists()) dir.mkdirs();

        List<String> urls = new ArrayList<>();
        for (MultipartFile file : files) {
            if (file.isEmpty()) continue;
            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            String savePath = Paths.get(uploadDir, fileName).toString();
            try {
                file.transferTo(new File(savePath));
                String url = "/images/auction/" + fileName;
                AuctionImage image = new AuctionImage();
                image.setAuctionId(auctionId);
                image.setUrl(url);
                auctionImageMapper.insert(image);
                urls.add(url);
            } catch (IOException e) {
                throw new RuntimeException("파일 업로드 실패: " + file.getOriginalFilename(), e);
            }
        }
        return urls;
    }

}
