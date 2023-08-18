import { createContext, useContext, useState, useEffect } from "react";
import { io } from "socket.io-client";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  //put in useEffect to only be read when mounted. not everytime comopnent is being used
  useEffect(() => {
    const newSocket = io("http://localhost:3000/", { autoConnect: false });
    setSocket(newSocket)

    return () => {
        newSocket.disconnect();
      };
    }, []);
  

  //Passing the components that can use this component by writing children
  return (
    //value will be availible inside app(children) component now
    <SocketContext.Provider
      value={ socket }>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
    return useContext(SocketContext);
  };
