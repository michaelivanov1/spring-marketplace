package com.marketapp.marketapp.ViewModels;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.stereotype.Component;

@Document(collection = "files")
@Getter
@Setter
@Component
public class FileMetadata {

    @Id
    private String id;
    private String filename;
    private long size;
}
