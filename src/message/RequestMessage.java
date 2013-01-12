package message;

import java.io.BufferedReader;
import java.io.IOException;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Define o formato e o processamento da mensagem de requisição.
 */
public class RequestMessage {
    private RequestLine requestLine = new RequestLine();
    private Headers headers = new Headers();
    private String body;

    public RequestMessage(BufferedReader message) {
        parseMessage(message);
    }
    
    public String getBody() {
        return body;
    }

    public Headers getHeaders() {
        return headers;
    }

    public RequestLine getRequestLine() {
        return requestLine;
    }
    
    /*
     * Realiza o processamento da mensagem de requisição.
     */
    private void parseMessage(BufferedReader message){
        // Processa a linha de requisição da mensagem.
        try {
            this.requestLine.parseRequestLine(message.readLine());
        } catch (IOException ex) {
            Logger.getLogger(RequestMessage.class.getName()).log(Level.SEVERE, null, ex);
            System.out.println("[ERROR]: RequestLine from client.");
        }
        // Processa os cabeçalhos da mensagem.
        String header;
        try {
            while(!(header = message.readLine()).equals("")){
                this.headers.addHeader(header);
            }
        } catch (IOException ex) {
            Logger.getLogger(RequestMessage.class.getName()).log(Level.SEVERE, null, ex);
            System.out.println("[ERROR]: RequestHeader from client.");
        }
        
        // Lê o corpo da mensagem de acordo com o tamanho referente nos cabeçalho.
        if (headers.getHeaders().containsKey("Content-Lenght")){
            Integer contentLenght = Integer.parseInt(headers.getHeaders().get("Content-Lenght"));
            try {
                message.skip(contentLenght);
            } catch (IOException ex) {
                Logger.getLogger(RequestMessage.class.getName()).log(Level.SEVERE, null, ex);
            }
            
        }
        
    
    }
    @Override
    public String toString(){
        return this.requestLine.toString()+this.headers.toString();
    }
    
    
}
