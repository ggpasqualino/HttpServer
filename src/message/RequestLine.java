package message;

/**
 * Define o formato e parse da linha de requisição da mensagem de requisição,
 * ou seja, a primeira linha da mensagem de requisição.
 */
public class RequestLine {
    
    private String method;
    private String requestUrl;
    private String version;
    public static String separator = " ";

    public String getMethod() {
        return method;
    }

    public void setMethod(String method) {
        this.method = method;
    }

    public String getRequestUrl() {
        return requestUrl;
    }

    public void setRequestUrl(String requestUrl) {
        this.requestUrl = requestUrl;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }
    
    public void parseRequestLine(String requestLine){
        String[] tokensLine = requestLine.split(" ");
        if (tokensLine.length >= 3){
            this.method = tokensLine[0];
            this.requestUrl = tokensLine[1];
            this.version = tokensLine[2];
        }
    }

    @Override
    public String toString() {
        return method + separator + requestUrl + separator + version + "\r\n";
    }    
    
}
