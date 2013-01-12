package message;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.util.logging.Level;
import java.util.logging.Logger;
import serverhttp.*;

/**
 * Define o formato da mensagem de resposta, além da criação da mensagem de
 * resposta.
 */
public class ResponseMessage {
    
    private ResponseLine responseLine;
    private Headers header;
    private byte body[];

    public ResponseMessage(RequestMessage request) {
        header = new Headers();
        body = new byte[0];
        response(request);
    }
   
    /*
     * Cria uma mensagem de resposta baseada na mensagem de requisição.
     */
    private void response(RequestMessage request){
        RequestLine reqline = request.getRequestLine();
        responseLine = new ResponseLine();
        responseLine.setVersion(ServerHttp.version);
        // Verifica se o tipo da requisição é 'GET'
        if(reqline.getMethod().equalsIgnoreCase("GET")){
            String requestUrl = reqline.getRequestUrl();
            requestUrl = ServerHttp.serverPath + requestUrl;
            File requestFile = new File(requestUrl);
            // Se não declarado, usa index.html como arquivo default.
            if(requestFile.exists() && requestFile.isDirectory()){
                requestUrl += "index.html";
                requestFile = new File(requestUrl);
            }
            // Gera resposta de status 'OK' (200).
            if(requestFile.exists()){
                responseLine.setStatus("200");
                responseLine.setReasonPhrase("OK");
                try {
                    FileInputStream fis = new FileInputStream(requestFile);
                    header = new Headers();
                    header.addHeader("Content-Lenght", Integer.toString( (int) requestFile.length() ));
                    header.addHeader("Connection", "keep-alive");
                    String tipos[] = requestUrl.split("\\.");
                    String tipo = tipos[tipos.length -1];
                    header.addHeader("Content-Type", retrieveType(tipo));
                    body = new byte[(int) requestFile.length()];
                    fis.read(body);
                    fis.close();                   
                }catch (FileNotFoundException e){
                    error404();
                }catch (Exception e) {
                    e.printStackTrace();
                    error500();                   
                }               
            }else{
                error404();
            }            
        } else{
            error501(reqline.getMethod());
        }
    }
    
    /*
     * Gera resposta de erro interno do servidor (501).
     */
    private void error500() {
        responseLine.setStatus("500");
        responseLine.setReasonPhrase("Internal Server Error");
        String text = "Error 500: Internal Server Error";
        header.addHeader("Content-Type: ", "text/html" + "\r\n");
        header.addHeader("Content-Lenght: ", Integer.toString(text.length()));
        body = text.getBytes();
    }

    /*
     * Gera resposta de erro: arquivo não encontrado (404).
     */
    private void error404(){
        try {
        responseLine.setStatus("404");
        responseLine.setReasonPhrase("Not Found");
        String text = "<meta http-equiv=\"refresh\" content=\"0.1; url=/404.html\">";
        body = text.getBytes();
        header.addHeader("Content-Type", "text/html");
        header.addHeader("Content-Lenght", "" + body.length);
        } catch (Exception ex) {
            Logger.getLogger(ResponseMessage.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    /*
     * Gera resposta de erro: função não implementada (501).
     */
    private void error501(String method) {
        responseLine.setStatus("501");
        responseLine.setReasonPhrase("Not Implemented");
        String text = "Error 501: Method " + method + " not implemented";
        header.addHeader("Content-Type: ", "text/html" + "\r\n");
        header.addHeader("Content-Lenght: ", Integer.toString(text.length()));
        body = text.getBytes();
    }
    
    private String retrieveType(String type) {
        String typebase = "";
        if(type.equalsIgnoreCase("jpg") ||
           type.equalsIgnoreCase("png") ||
           type.equalsIgnoreCase("gif") ||
           type.equalsIgnoreCase("jpg")){
            typebase = "image/" + type;
        }
        else if(type.equalsIgnoreCase("htm") ||
           type.equalsIgnoreCase("html")){
           typebase = "text/html";
        }
        else if(type.equalsIgnoreCase("css")){
            typebase = "text/css";
        }
        else {typebase = "text/plain";}
        return typebase;
    }
    
    public byte[] getBody() {
        return body;
    }

    public Headers getHeader() {
        return header;
    }


    public ResponseLine getResponseLine() {
        return responseLine;
    }

    @Override
    public String toString() {
        return responseLine.toString() + header.toString() + "\r\n" + new String(body);
    }
    
    public byte[] toByte(){
        byte[] temp = responseLine.toString().getBytes();
        byte[] temp2 = header.toString().getBytes();
        
        byte response[] = new byte[temp.length + temp2.length + body.length];
        int i = 0;
        for(byte b : temp){
            response[i] = b;
            i++;            
        }
        for(byte b : temp2){
            response[i] = b;
            i++;            
        }
        for(byte b : body){
            response[i] = b;
            i++;            
        }
        return response;
    }
    
    
}
