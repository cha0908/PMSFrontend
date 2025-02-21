import { useEffect, useRef } from 'react';
import { Client, Frame } from '@stomp/stompjs';
import { Positions } from '../types/position';
import SockJS from 'sockjs-client';

interface UseWebSocketProps {
  setPositions: (positions: Positions) => void;
  setIsLoading: (loading: boolean) => void;
}

// Mock data
const mockPositions = {
  'P001': {
    PositionID: 'P001',
    Symbol: 'AAPL',
    Qty: 100,
    AverageCost: 150.50,
    UnrealizedPnL: 500.00,
    Currency: 'USD',
    CurrentPrice: 155.50
  },
  'P002': {
    PositionID: 'P002',
    Symbol: 'GOOGL',
    Qty: 50,
    AverageCost: 2800.00,
    UnrealizedPnL: -200.00,
    Currency: 'USD',
    CurrentPrice: 2796.00
  }
};

export const useWebSocket = ({ setPositions, setIsLoading }: UseWebSocketProps) => {
  const stompClient = useRef<Client | null>(null);

  useEffect(() => {
    stompClient.current = new Client({
      brokerURL: 'ws://localhost:8083/positions',
      connectHeaders: {},
      debug: (str) => {
        console.log('STOMP: ' + str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    stompClient.current.onConnect = () => {
      console.log('Connected to STOMP');
      
      stompClient.current?.subscribe('/topic/positions', (message) => {
        if (message.body) {
          console.log('Received message:', message.body);
          const positions = JSON.parse(message.body);
          setPositions(positions);
          setIsLoading(false);
        }
      });
    };

    stompClient.current.onStompError = (frame) => {
      console.error('STOMP error:', frame);
    };

    stompClient.current.activate();

    return () => {
      if (stompClient.current?.active) {
        stompClient.current.deactivate();
      }
    };
  }, []);

  return stompClient.current;
}; 