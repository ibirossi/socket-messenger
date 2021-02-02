import React, { useContext, useEffect, useState } from "react";
import io from 'socket.io-client';

const SocketContext = React.createContext();

export function useSocket() {
  return useContext(SocketContext);
}

//send id to server. id comes from useEffect
export function SocketProvider({ id, children }) {
  const [socket, setSocket] = useState();

  //this will be side effect.  Only want to create socket when initially load page
  //and when id changes.
  useEffect(() => {
    const newSocket = io(
        "http://localhost: 5000", 
        { query: { id } }
        );
    //
    setSocket(newSocket);
    //when this useEffect runs for 2nd time => remove old socket. Prevents multiple sockets
    //componentWillUnmount?
    return () => newSocket.close()
  }, [id]);

  return (
    <div>
      {/* {socket} will be state */}
      <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
    </div>
  );
}
