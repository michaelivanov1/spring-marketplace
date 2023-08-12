package com.marketapp.marketapp.Controllers;

import com.marketapp.marketapp.DAL.FileService;
import com.marketapp.marketapp.ViewModels.AuthenticationResponse;
import com.marketapp.marketapp.ViewModels.FileMetadata;
import com.mongodb.client.gridfs.model.GridFSFile;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.gridfs.GridFsResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/file")
@RequiredArgsConstructor

public class FileController {

    private final FileService fileService;

    @PostMapping("/")
    public ResponseEntity<String> addFile(@RequestParam MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.status
                    (HttpStatus.BAD_REQUEST).body("No file uploaded; select a file.");
        }

        try {
            return new ResponseEntity<>(fileService.storeFile(file),
                    HttpStatus.CREATED);
        }
        catch (IOException ex) {
            ex.printStackTrace();
            return ResponseEntity.status
                    (HttpStatus.INTERNAL_SERVER_ERROR).body("File upload failed: " + ex.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<GridFSFile> findFile(@PathVariable String id) {
        return new ResponseEntity<>(fileService.findFile(id), HttpStatus.OK);
    }

    @GetMapping("/")
    public ResponseEntity<List<GridFSFile>> findAll() {
        return new ResponseEntity<>(fileService.findAll(), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> deleteOne(@PathVariable String id) {
        if (fileService.deleteOne(id)) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        else {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
