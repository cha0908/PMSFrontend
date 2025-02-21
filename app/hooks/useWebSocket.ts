"use client"
import { useEffect, useRef } from 'react';
import { Positions } from '../types/position';
import { Client, Frame } from '@stomp/stompjs';

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
    const initWebSocket = setTimeout(() => {
      try {
        console.log('Initializing STOMP WebSocket connection...');
        
        stompClient.current = new Client({
          brokerURL: 'ws://localhost:8083/positions',
          debug: (str) => {
            console.log('STOMP Debug:', str);
          },
          onConnect: (frame: Frame | undefined) => {
            console.log('Connected to STOMP:', frame);
            
            stompClient.current?.subscribe('/topic/positions', (message) => {
              try {
                console.log('Raw message received:', message.body);
                const positions = JSON.parse(message.body);
                console.log('Parsed positions:', positions);
                setPositions(positions);
                setIsLoading(false);
              } catch (parseError) {
                console.error('Error parsing message:', parseError);
              }
            });
          },
          onStompError: (frame) => {
            console.error('STOMP error:', frame);
          },
          onWebSocketError: (error) => {
            console.error('WebSocket error:', error);
            if (stompClient.current?.webSocket) {
              console.log('WebSocket state:', {
                url: stompClient.current.webSocket.url,
                readyState: stompClient.current.webSocket.readyState
              });
            }
          }
        });

        stompClient.current.activate();
        
      } catch (error) {
        console.error('Error in STOMP setup:', error);
      }
    }, 1000);

    return () => {
      clearTimeout(initWebSocket);
      if (stompClient.current?.active) {
        stompClient.current.deactivate();
      }
    };
  }, [setPositions, setIsLoading]);

  return stompClient.current;
}; 