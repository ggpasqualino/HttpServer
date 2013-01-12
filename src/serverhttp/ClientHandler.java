package serverhttp;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.InputStreamReader;
import java.net.Socket;
import message.RequestMessage;
import message.ResponseMessage;


public class ClientHandler implements Runnable{
    BufferedReader input;
    Socket client;
    DataOutputStream output;
    
    /**
     * Define a entrada e saída do cliente
     * @param s 
     */    
    public ClientHandler(Socket s){
        client = s;
        try {
            input = new BufferedReader(new InputStreamReader(client.getInputStream()));
            output = new DataOutputStream(client.getOutputStream());            
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    /**
     * Recebe e responde as requisições do cliente enquanto houver requisições
     * no buffer de entrada
     */
    @Override
    public void run() {
        try {
            Thread.sleep(100);
            while(input.ready()){
                RequestMessage requestMessage = new RequestMessage(input);
                ResponseMessage response = new ResponseMessage(requestMessage);
                output.write(response.toByte());
                output.flush();
                Thread.sleep(100);
            }
            input.close();
            Thread.currentThread().join();
        } catch (Exception e) {
            e.printStackTrace(System.out);
        }
        
    }

}

