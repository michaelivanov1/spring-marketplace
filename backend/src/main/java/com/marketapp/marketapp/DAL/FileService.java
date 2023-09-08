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
import java.util.*;

@Service
public class FileService {

    @Autowired
    private GridFsTemplate gridFsTemplate;

    @Autowired
    private UserService userService;

    public String storeFile(String email, MultipartFile file) throws IOException {
        FileMetadata metadata = new FileMetadata();
        metadata.setFilename(file.getOriginalFilename());
        String uuid = UUID.randomUUID().toString();
        metadata.setId(uuid);
        metadata.setSize(file.getSize());

        ObjectId fileId = gridFsTemplate.store(file.getInputStream(), file.getOriginalFilename(), metadata);

        // store the unique id that was created in profileImage in accounts
        Map<String, Object> keyMap = new HashMap<>();
        keyMap.put("profileImage", uuid);
        userService.updateUserByFields(email, keyMap);

        return fileId.toString();
    }

    public GridFSFile findFileByObjectId(String id) {
        return gridFsTemplate.findOne(new Query(Criteria.where("_id").is(id)));
    }

    public GridFSFile findFileByUUid(String uuid) {
        return gridFsTemplate.findOne(new Query(Criteria.where("metadata._id").is(uuid)));
    }

    public List<GridFSFile> findAll() {
        List<GridFSFile> gridFSFiles = new ArrayList<GridFSFile>();
        gridFsTemplate.find(new Query()).into(gridFSFiles);
        return gridFSFiles;
    }

    public boolean deleteOne(String uuid) {
        try {
            gridFsTemplate.delete(new Query(Criteria.where("metadata._id").is(uuid)));
        } catch (Exception ex) {
            ex.printStackTrace();
            return false;
        }
        return true;
    }

    public GridFsResource getResource(GridFSFile uuid) {
        return gridFsTemplate.getResource(uuid);
    }
}
