package com.marketapp.marketapp.ViewModels;

import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Getter
@Setter
@NoArgsConstructor
public class QrInfo {
    private String url;
    private String imageStr;
}
