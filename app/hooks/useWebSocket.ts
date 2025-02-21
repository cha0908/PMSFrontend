"use client"
import { useEffect, useRef } from 'react';
import { Positions } from '../types/position';
import { Client, Frame } from '@stomp/stompjs';

interface UseWebSocketProps {
  setPositions: (positions: Positions) => void;
  setIsLoading: (loading: boolean) => void;
}


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
            console.log('Attempting to subscribe to /positionData...');
            
            stompClient.current?.subscribe('/topic/positionData', (message) => {
              console.log('Message received on /positionData');
              try {
                console.log('Raw message received:', message.body);
                const data = JSON.parse(message.body);
                console.log('Parsed data:', data);
                
                // Validate the data structure
                if (data && typeof data === 'object') {
                  setPositions(data);
                  setIsLoading(false);
                } else {
                  console.error('Invalid data structure received:', data);
                }
              } catch (parseError) {
                console.error('Error parsing message:', parseError);
              }
            });
            
            console.log('Subscription complete');
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