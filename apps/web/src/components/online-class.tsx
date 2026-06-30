'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiMic, FiMicOff, FiVideo, FiVideoOff, FiMonitor, FiMessageSquare, FiUserPlus, FiMoreVertical } from 'react-icons/fi';
import { useSocket } from '@/hooks/useSocket';

interface Participant {
  id: string;
  name: string;
  isMuted: boolean;
  isVideoOn: boolean;
  isHandRaised: boolean;
}

interface OnlineClassProps {
  classId: string;
  className: string;
  isTeacher: boolean;
}

export function OnlineClass({ classId, className, isTeacher }: OnlineClassProps) {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showChat, setShowChat] = useState(false);

  const { joinClass, leaveClass, sendMessage, onMessage } = useSocket();

  useEffect(() => {
    joinClass(classId);

    // Mock participants
    setParticipants([
      { id: '1', name: isTeacher ? 'دانشجو ۱' : 'استاد', isMuted: false, isVideoOn: true, isHandRaised: false },
      { id: '2', name: isTeacher ? 'دانشجو ۲' : 'شما', isMuted: true, isVideoOn: false, isHandRaised: false },
      { id: '3', name: isTeacher ? 'دانشجو ۳' : '', isMuted: true, isVideoOn: false, isHandRaised: true },
    ]);

    const cleanup = onMessage((message: any) => {
      setChatMessages((prev) => [...prev, message]);
    });

    return () => {
      leaveClass(classId);
      cleanup();
    };
  }, [classId]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      sendMessage(classId, newMessage);
      setNewMessage('');
    }
  };

  return (
    <div className="flex flex-col h-[50vh] lg:h-[calc(100vh-200px)]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div>
          <h2 className="font-semibold text-sm lg:text-base">{className}</h2>
          <p className="text-xs lg:text-sm text-muted-foreground">{participants.length} شرکت‌کننده</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-xs lg:text-sm text-green-600">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            زنده
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Video Grid */}
        <div className="flex-1 p-2 lg:p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 lg:gap-4 h-full">
            {participants.map((participant) => (
              <div
                key={participant.id}
                className="relative bg-muted rounded-xl overflow-hidden"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-xl font-bold text-primary">
                      {participant.name.charAt(0)}
                    </span>
                  </div>
                </div>
                
                {/* Participant Info */}
                <div className="absolute bottom-2 right-2 left-2 flex items-center justify-between">
                  <span className="text-xs bg-black/50 text-white px-2 py-1 rounded">
                    {participant.name}
                  </span>
                  <div className="flex items-center gap-1">
                    {participant.isMuted && (
                      <span className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
                        <FiMicOff className="h-3 w-3 text-white" />
                      </span>
                    )}
                    {participant.isHandRaised && (
                      <span className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center">
                        <FiUserPlus className="h-3 w-3 text-white" />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Sidebar */}
        {showChat && (
          <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-r flex flex-col h-48 lg:h-auto">
            <div className="p-4 border-b">
              <h3 className="font-semibold">گفتگو</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.map((msg, index) => (
                <div key={index} className="text-sm">
                  <span className="font-medium">{msg.sender}: </span>
                  <span className="text-muted-foreground">{msg.text}</span>
                </div>
              ))}
            </div>
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="پیام بنویسید..."
                />
                <button
                  onClick={handleSendMessage}
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium"
                >
                  ارسال
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 p-4 border-t bg-background">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
            isMuted ? 'bg-red-500 text-white' : 'bg-muted hover:bg-muted/80'
          }`}
        >
          {isMuted ? <FiMicOff className="h-5 w-5" /> : <FiMic className="h-5 w-5" />}
        </button>
        
        <button
          onClick={() => setIsVideoOn(!isVideoOn)}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
            !isVideoOn ? 'bg-red-500 text-white' : 'bg-muted hover:bg-muted/80'
          }`}
        >
          {isVideoOn ? <FiVideo className="h-5 w-5" /> : <FiVideoOff className="h-5 w-5" />}
        </button>

        <button
          onClick={() => setIsScreenSharing(!isScreenSharing)}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
            isScreenSharing ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
          }`}
        >
          <FiMonitor className="h-5 w-5" />
        </button>

        <button
          onClick={() => setShowChat(!showChat)}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
            showChat ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
          }`}
        >
          <FiMessageSquare className="h-5 w-5" />
        </button>

        <button className="w-12 h-12 rounded-full bg-red-500 text-white flex items-center justify-center">
          <span className="text-sm font-medium">پایان</span>
        </button>
      </div>
    </div>
  );
}
