package com.marketapp.marketapp.ViewModels;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Base64;
import java.util.UUID;

@Document(collection = "orders")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Component
public class Order {

    @Id
    private ObjectId id;

    private String buyerEmail;
    private String sellerEmail;
    private double grandTotal;
    private String invoiceDate;
    private String orderId;
    private ArrayList<OrderProduce> orderProduceList;
    private String qrcodeurl;
    private String qrcodetxt;

    public void createNewOrder(String buyerEmail, String sellerEmail, double grandTotal, ArrayList<OrderProduce> orderProduceList) {
        this.buyerEmail = buyerEmail;
        this.sellerEmail = sellerEmail;
        this.grandTotal = grandTotal;

        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss");
        LocalDateTime now = LocalDateTime.now();
        this.invoiceDate = dtf.format(now);

        this.orderProduceList = orderProduceList;
        this.orderId = UUID.randomUUID().toString();

        String url = "/order/id/" + orderId;

        int imageSize = 200;
        try {
            BitMatrix matrix = new MultiFormatWriter().encode(url, BarcodeFormat.QR_CODE,
                    imageSize, imageSize);
            ByteArrayOutputStream bos = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(matrix, "png", bos);
            String image = Base64.getEncoder().encodeToString(bos.toByteArray()); // base64 encode

            // return QrInfo
            QrInfo qrInfo = new QrInfo();
            qrInfo.setUrl(url);
            qrInfo.setImageStr(image);

            this.qrcodeurl = qrInfo.getUrl();
            this.qrcodetxt = qrInfo.getImageStr();
        }
        catch (WriterException | IOException ex) {
            ex.printStackTrace();
        }

    }

}
