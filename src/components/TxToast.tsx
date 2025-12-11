/**
 * TxToast Component
 * Transaction status notification
 */

"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Transaction } from "@/types";

interface TxToastProps {
  transaction: Transaction | null;
  onClose: () => void;
}

export default function TxToast({ transaction, onClose }: TxToastProps) {
  useEffect(() => {
    if (transaction?.status === "success" || transaction?.status === "error") {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [transaction, onClose]);

  if (!transaction) return null;

  const getIcon = () => {
    switch (transaction.status) {
      case "pending":
        return (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        );
      case "confirming":
        return (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        );
      case "success":
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        );
      case "error":
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  const getColor = () => {
    switch (transaction.status) {
      case "pending":
      case "confirming":
        return "bg-blue-500";
      case "success":
        return "bg-green-500";
      case "error":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, x: "-50%" }}
        animate={{ opacity: 1, y: 0, x: "-50%" }}
        exit={{ opacity: 0, y: 50, x: "-50%" }}
        className="fixed bottom-6 left-1/2 z-50 max-w-md w-full mx-4"
      >
        <div className={`${getColor()} rounded-2xl shadow-2xl p-4 text-white`}>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">{transaction.message}</p>
              {transaction.signature && (
                <a
                  href={`https://explorer.solana.com/tx/${transaction.signature}?cluster=devnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs underline hover:no-underline mt-1 inline-block"
                >
                  View on Explorer
                </a>
              )}
              {transaction.error && (
                <p className="text-xs mt-1 opacity-90">{transaction.error}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
