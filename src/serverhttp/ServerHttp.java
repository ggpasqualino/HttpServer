package serverhttp;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.ServerSocket;
import java.net.Socket;


public class ServerHttp {

    ServerSocket server;
    
    public static final String serverPath = "./htmldocs"; //diretório para os arquivos do servidor
    public static final String version = "HTTP/1.1";      //versão http do servidor
    
    /**
     * Inicia o socket do servidor
     * Fica em loop aceitando conexões de cliente
     * Cada conexão aceita é tratada por um novo ClientHandler
     */
    public void start(){
        try {            
            server = new ServerSocket(8888);
            while(true){
                Socket clientSocket = server.accept();
                ClientHandler client = new ClientHandler(clientSocket);
                Thread clientThread = new Thread(client);
                clientThread.start();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    public static void main(String[] args) {
        new ServerHttp().start();
    }
}
