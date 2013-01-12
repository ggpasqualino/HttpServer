package message;

/**
 * Define o formato da linha de resposta da mensagem de resposta, ou seja,
 * a primeira linha da mensagem de resposta
 */
public class ResponseLine {
    
    private String version;
    private String status;
    private String reasonPhrase;
    public static String separator = " ";

    public String getReasonPhrase() {
        return reasonPhrase;
    }

    public void setReasonPhrase(String reasonPhrase) {
        this.reasonPhrase = reasonPhrase;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    @Override
    public String toString() {
        return version + separator + status + separator + reasonPhrase + "\r\n";
    }
     
}
