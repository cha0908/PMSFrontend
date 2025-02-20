import { useEffect, useRef } from 'react';
import { Client, Frame } from '@stomp/stompjs';
import { Positions } from '../types/position';

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
    // Create STOMP client
    stompClient.current = new Client({
      brokerURL: 'ws://localhost:8083/positions', // Match your backend endpoint
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    // Handle connection
    stompClient.current.onConnect = (frame: Frame | undefined) => {
      console.log('Connected to STOMP:', frame);
      
      // Subscribe to position updates from backend
      stompClient.current?.subscribe('/topic/positions', (message) => {
        if (message.body) {
          const positions = JSON.parse(message.body);
          setPositions(positions);
          setIsLoading(false);
        }
      });
    };

    // Activate connection
    stompClient.current.activate();

    // Cleanup on unmount
    return () => {
      if (stompClient.current?.active) {
        stompClient.current.deactivate();
      }
    };
  }, []);

  return stompClient.current;
}; 