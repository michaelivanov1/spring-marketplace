package com.marketapp.marketapp.DAL;

import com.marketapp.marketapp.ViewModels.FileMetadata;
import com.mongodb.client.gridfs.model.GridFSFile;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.gridfs.GridFsResource;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class FileService {

    @Autowired
    private GridFsTemplate gridFsTemplate;

    public String storeFile(MultipartFile file) throws IOException {
        FileMetadata metadata = new FileMetadata();
        metadata.setFilename(file.getOriginalFilename());
        metadata.setId(UUID.randomUUID().toString());
        metadata.setSize(file.getSize());

        ObjectId fileId = gridFsTemplate.store(file.getInputStream(), file.getOriginalFilename(), metadata);
        return fileId.toString();
    }

    public GridFSFile findFile(String id) {
        return gridFsTemplate.findOne(new Query(Criteria.where("_id").is(id)));
    }

    public List<GridFSFile> findAll() {
        List<GridFSFile> gridFSFiles = new ArrayList<GridFSFile>();
        gridFsTemplate.find(new Query()).into(gridFSFiles);
        return gridFSFiles;
    }

    public boolean deleteOne(String id) {
        try {
            gridFsTemplate.delete(new Query(Criteria.where("_id").is(id)));
        }
        catch (Exception ex) {
            ex.printStackTrace();
            return false;
        }
        return true;
    }
}
