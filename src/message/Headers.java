package message;

import java.util.HashMap;
import java.util.Map.Entry;

/**
 * Define o formato e parse do cabeçalho tanto da mensagem de requisição quanto da
 * mensagem de resposta
 */
public class Headers {
    private HashMap<String,String> headers = new HashMap();
    
    public void addHeader(String stringHeader) {
        String[] tokensHeader = stringHeader.split(": +");
        if (tokensHeader.length == 2) {
            this.headers.put(tokensHeader[0], tokensHeader[1]);
        }
    }
    
    public void addHeader(String key, String value) {
        this.headers.put(key, value);
    }

    public HashMap<String, String> getHeaders() {
        return headers;
    }
    
    @Override
    public String toString() {
        String stream = "";
        for (Entry entry : headers.entrySet()){
            stream += (entry.getKey().toString() + ": " + entry.getValue().toString() + "\r\n");
        }
        stream += "\r\n";
        return stream;
    }
    
}
