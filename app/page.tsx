"use client"

import { useAuth } from "./contexts/AuthContext";
import Link from "next/link";
import Navbar from "./components/Navbar";
import { useState } from 'react';
import { Position, Positions } from './types/position';
import { useWebSocket } from './hooks/useWebSocket';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, ClientSideRowModelModule, provideGlobalGridOptions } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

// Add this before your component
provideGlobalGridOptions({ theme: 'legacy' });

// Add these CSS overrides after your other imports
const gridThemeOverrides = `
  .ag-theme-alpine-dark {
    --ag-background-color: rgba(255, 255, 255, 0.1);
    --ag-header-background-color: rgba(255, 255, 255, 0.15);
    --ag-odd-row-background-color: rgba(255, 255, 255, 0.05);
    --ag-header-foreground-color: #fff;
    --ag-foreground-color: #fff;
    --ag-border-color: rgba(255, 255, 255, 0.1);
    --ag-row-hover-color: rgba(255, 255, 255, 0.2);
  }
`;

export default function Home() {
  const { user } = useAuth();
  const [positions, setPositions] = useState<Positions>({ positionData: [] });
  const [isLoading, setIsLoading] = useState(true);
  
  // AG Grid Column Definitions
  const columnDefs: ColDef<Position>[] = [
    { field: 'positionId' as keyof Position, headerName: 'Position ID', flex: 1 },
    { field: 'ticker' as keyof Position, headerName: 'Symbol', flex: 1 },
    { 
      field: 'totalQty' as keyof Position,
      headerName: 'Quantity',
      flex: 1,
      type: 'numericColumn',
      valueFormatter: (params) => Number(params.value).toFixed(4)
    },
    { 
      field: 'avgPrice' as keyof Position, 
      headerName: 'Average Price',
      flex: 1,
      type: 'numericColumn',
      valueFormatter: (params) => Number(params.value).toFixed(2)
    },
    { 
      field: 'unrealizedPnl' as keyof Position, 
      headerName: 'Unrealized P&L',
      flex: 1,
      type: 'numericColumn',
      valueFormatter: (params) => Number(params.value).toFixed(2),
      cellStyle: (params) => {
        if (params.value > 0) return { color: '#4ade80' }; // green
        if (params.value < 0) return { color: '#f87171' }; // red
        return null;
      }
    },
    { field: 'currency' as keyof Position, headerName: 'Currency', flex: 1 },
    { 
      field: 'lastPrice' as keyof Position, 
      headerName: 'Last Price',
      flex: 1,
      type: 'numericColumn',
      valueFormatter: (params) => Number(params.value).toFixed(2)
    }
  ];

  // AG Grid Default Column Definition
  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true
  };

  useWebSocket({ setPositions, setIsLoading });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-indigo-900 to-purple-900 flex flex-col">
      {user && <Navbar />}
      <main className="flex-grow flex flex-col items-center p-4">
        <div className="w-full max-w-7xl">
          <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            Welcome{user ? `, ${user.username}!` : "!"}
          </h1>
          {!user ? (
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="/login" className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-center py-3 px-6 rounded-full hover:from-blue-600 hover:to-purple-600 transition-all transform hover:scale-105 active:scale-95 shadow-lg">
                Log in
              </Link>
              <Link href="/signup" className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-3 px-6 rounded-full hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 active:scale-95 shadow-lg">
                Sign up
              </Link>
            </div>
          ) : (
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 w-full border border-white/10">
              <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Your Positions
              </h2>
              <div className="ag-theme-alpine-dark" style={{ height: '500px', width: '100%' }}>
                <AgGridReact
                  modules={[ClientSideRowModelModule]}
                  columnDefs={columnDefs}
                  rowData={positions.positionData}
                  defaultColDef={defaultColDef}
                  animateRows={true}
                  domLayout='autoHeight'
                />
              </div>
            </div>
          )}
        </div>
      </main>
      <style jsx global>{gridThemeOverrides}</style>
    </div>
  );
}