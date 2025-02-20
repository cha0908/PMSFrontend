import { useEffect, useRef } from 'react';
import { Client, Frame } from '@stomp/stompjs';
import { Positions } from '../types/position';

interface UseWebSocketProps {
  setPositions: (positions: Positions) => void;
  setIsLoading: (loading: boolean) => void;
}

export const useWebSocket = ({ setPositions, setIsLoading }: UseWebSocketProps) => {
  const stompClient = useRef<Client | null>(null);

  useEffect(() => {
    stompClient.current = new Client({
      brokerURL: 'ws://localhost:8080/ws',
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    stompClient.current.onConnect = (frame: Frame | undefined) => {
      console.log('Connected to STOMP:', frame);
      
      stompClient.current?.subscribe('/topic/positions', (message) => {
        if (message.body) {
          const positions = JSON.parse(message.body);
          setPositions(positions);
          setIsLoading(false);
        }
      });
    };

    stompClient.current.onStompError = (frame: Frame) => {
      console.error('STOMP error:', frame);
    };

    stompClient.current.onWebSocketClose = (event) => {
      console.log('WebSocket closed:', event);
    };

    stompClient.current.onWebSocketError = (error) => {
      console.error('WebSocket error:', error);
    };

    stompClient.current.activate();

    return () => {
      if (stompClient.current?.active) {
        stompClient.current.deactivate();
      }
    };
  }, [setPositions, setIsLoading]);

  return stompClient.current;
}; 