"use client"

import { useAuth } from "./contexts/AuthContext";
import Link from "next/link";
import Navbar from "./components/Navbar";
import { useState } from 'react';
import { Position, Positions } from './types/position';
import { useWebSocket } from './hooks/useWebSocket';

export default function Home() {
  const { user } = useAuth();
  const [positions, setPositions] = useState<Positions>({});
  const [isLoading, setIsLoading] = useState(true);
  
  // Use the WebSocket hook
  useWebSocket({ setPositions, setIsLoading });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-indigo-900 to-purple-900 flex flex-col">
      {user && <Navbar />}
      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <h1 className="text-6xl sm:text-7xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            Welcome{user ? `, ${user.username}!` : "!"}
          </h1>
          {!user && (
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                href="/login"
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-center py-3 px-6 rounded-full hover:from-blue-600 hover:to-purple-600 transition-all transform hover:scale-105 active:scale-95 shadow-lg"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-3 px-6 rounded-full hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 active:scale-95 shadow-lg"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
        {user && (
          <div className="mt-8 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 w-full max-w-4xl border border-white/10 transform transition-transform hover:scale-102">
            <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Your Positions</h2>
            {isLoading ? (
              <div className="flex justify-center items-center">
                <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-white border-collapse">
                  <thead>
                    <tr className="bg-white/10">
                      <th className="p-3 text-left">PositionID</th>
                      <th className="p-3 text-left">Symbol</th>
                      <th className="p-3 text-left">Qty</th>
                      <th className="p-3 text-left">Average Cost</th>
                      <th className="p-3 text-left">Unrealized PnL</th>
                      <th className="p-3 text-left">Currency</th>
                      <th className="p-3 text-left">Current Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.values(positions).map((position: Position) => (
                      <tr key={position.PositionID} className="border-b border-white/10 hover:bg-white/10 transition-colors">
                        <td className="p-3">{position.PositionID}</td>
                        <td className="p-3">{position.Symbol}</td>
                        <td className="p-3">{position.Qty}</td>
                        <td className="p-3">{position.AverageCost.toFixed(2)}</td>
                        <td
                          className={`p-3 ${
                            position.UnrealizedPnL > 0
                              ? 'text-green-400'
                              : position.UnrealizedPnL < 0
                              ? 'text-red-400'
                              : 'text-white'
                          }`}
                        >
                          {position.UnrealizedPnL.toFixed(2)}
                        </td>
                        <td className="p-3">{position.Currency}</td>
                        <td className="p-3">{position.CurrentPrice.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>
      <style jsx>{`
        .loader {
          border-top-color: #3498db;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}