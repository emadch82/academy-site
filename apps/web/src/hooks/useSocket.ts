'use client';

import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import Cookies from 'js-cookie';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

let socket: Socket | null = null;

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const token = Cookies.get('amz_access');
    if (!token) return;

    socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => {
      console.log('Socket connected');
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    socketRef.current = socket;

    return () => {
      socket?.disconnect();
      socket = null;
    };
  }, []);

  const joinRoom = useCallback((roomId: string) => {
    socket?.emit('join-room', roomId);
  }, []);

  const leaveRoom = useCallback((roomId: string) => {
    socket?.emit('leave-room', roomId);
  }, []);

  const sendMessage = useCallback((roomId: string, message: string) => {
    socket?.emit('send-message', { roomId, message });
  }, []);

  const onMessage = useCallback((callback: (message: any) => void) => {
    socket?.on('receive-message', callback);
    return () => {
      socket?.off('receive-message', callback);
    };
  }, []);

  const joinClass = useCallback((classId: string) => {
    socket?.emit('join-class', classId);
  }, []);

  const leaveClass = useCallback((classId: string) => {
    socket?.emit('leave-class', classId);
  }, []);

  const onNotification = useCallback((callback: (notification: any) => void) => {
    socket?.on('notification', callback);
    return () => {
      socket?.off('notification', callback);
    };
  }, []);

  const onAttendanceUpdate = useCallback((callback: (data: any) => void) => {
    socket?.on('attendance-update', callback);
    return () => {
      socket?.off('attendance-update', callback);
    };
  }, []);

  return {
    socket: socketRef.current,
    joinRoom,
    leaveRoom,
    sendMessage,
    onMessage,
    joinClass,
    leaveClass,
    onNotification,
    onAttendanceUpdate,
  };
}
