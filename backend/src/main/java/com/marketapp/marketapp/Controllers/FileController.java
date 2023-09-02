package com.marketapp.marketapp.Controllers;

import com.marketapp.marketapp.DAL.FileService;
import com.marketapp.marketapp.ViewModels.AuthenticationResponse;
import com.marketapp.marketapp.ViewModels.FileMetadata;
import com.mongodb.client.gridfs.model.GridFSFile;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.gridfs.GridFsResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:8080")
@RequiredArgsConstructor

public class FileController {

    private final FileService fileService;

    @PostMapping(value = "/file", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE,
            MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<String> addFile(@RequestPart("email") String email,
            @RequestPart("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No file uploaded; select a file.");
        }
        if (email == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("No email given; select an email to associate the image with.");
        }

        if (file.getSize() >= 1.6e+7) {
            return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE).body("File exceeds upload limit (16MB).");
        }

        try {
            return new ResponseEntity<>(fileService.storeFile(email, file),
                    HttpStatus.CREATED);
        } catch (IOException ex) {
            ex.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("File upload failed: " + ex.getMessage());
        }
    }

    @GetMapping("/file/{uuid}")
    public ResponseEntity<GridFSFile> findFileByUUID(@PathVariable String uuid) {
        return new ResponseEntity<>(fileService.findFileByUUid(uuid), HttpStatus.OK);
    }

    @GetMapping("/file")
    public ResponseEntity<List<GridFSFile>> findAll() {
        return new ResponseEntity<>(fileService.findAll(), HttpStatus.OK);
    }

    @DeleteMapping("/file/{uuid}")
    public ResponseEntity<Boolean> deleteOne(@PathVariable String uuid) {
        if (fileService.deleteOne(uuid)) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
