import { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, User, Bot } from 'lucide-react';
import type { Device } from '../../data/types';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function AIAssistantModule({ device }: { device: Device }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hello! I'm your BioMed AI Tutor for the ${device.name}. I can explain concepts, compare devices, generate viva questions, provide troubleshooting guidance, and recommend learning paths. Ask me anything about this device!`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const generateResponse = (question: string): string => {
    const q = question.toLowerCase();

    if (q.includes('working principle') || q.includes('how does it work') || q.includes('how does this work')) {
      return `The ${device.name} works through the following steps:\n\n${device.workingPrinciple.map((s, i) => `${i + 1}. **${s.title}**: ${s.description}`).join('\n\n')}\n\nWould you like me to explain any specific step in more detail?`;
    }

    if (q.includes('component') || q.includes('parts') || q.includes('what are the parts')) {
      return `The ${device.name} has ${device.components.length} key components:\n\n${device.components.map((c) => `• **${c.name}**: ${c.function}`).join('\n')}\n\nClick any component in the Component Explorer module to learn more about it.`;
    }

    if (q.includes('troubleshoot') || q.includes('fault') || q.includes('problem') || q.includes('error') || q.includes('not working')) {
      return `Here are common troubleshooting scenarios for the ${device.name}:\n\n${device.troubleshooting.map((t, i) => `**Scenario ${i + 1}: ${t.scenario}**\nSymptom: ${t.symptom}\nCauses: ${t.possibleCauses.join(', ')}\nSolution: ${t.solution}`).join('\n\n')}\n\nYou can practice these in the Virtual Laboratory by injecting faults.`;
    }

    if (q.includes('maintenance') || q.includes('calibrat') || q.includes('clean') || q.includes('inspect')) {
      return `Maintenance for the ${device.name} includes:\n\n**Calibration:**\n${device.maintenance.calibration.map((c) => `• ${c}`).join('\n')}\n\n**Preventive Maintenance:**\n${device.maintenance.preventiveMaintenance.map((c) => `• ${c}`).join('\n')}\n\n**Electrical Safety:**\n${device.maintenance.electricalSafety.map((c) => `• ${c}`).join('\n')}\n\n**Daily Inspection:**\n${device.maintenance.dailyInspection.map((c) => `• ${c}`).join('\n')}`;
    }

    if (q.includes('viva') || q.includes('oral') || q.includes('exam question')) {
      const randomQ = device.vivaQuestions[Math.floor(Math.random() * device.vivaQuestions.length)];
      return `Here's a viva question for you:\n\n**Q: ${randomQ.question}**\n\nThink about your answer, then check the Viva Questions module for the model answer. Would you like another question?`;
    }

    if (q.includes('compare') || q.includes('difference') || q.includes('vs')) {
      return `To compare the ${device.name} with other devices, consider these key aspects:\n\n**Advantages:**\n${device.introduction.advantages.map((a) => `• ${a}`).join('\n')}\n\n**Limitations:**\n${device.introduction.limitations.map((l) => `• ${l}`).join('\n')}\n\nYou can explore other devices in the same category (${device.categoryId}) for direct comparison. Would you like me to recommend similar devices?`;
    }

    if (q.includes('application') || q.includes('use') || q.includes('used for')) {
      return `The ${device.name} has these clinical applications:\n\n${device.introduction.applications.map((a) => `• ${a}`).join('\n')}\n\nIts clinical importance: ${device.introduction.clinicalImportance}`;
    }

    if (q.includes('history') || q.includes('invent') || q.includes('who made') || q.includes('origin')) {
      return device.introduction.history;
    }

    if (q.includes('block diagram') || q.includes('signal flow')) {
      return `The ${device.name} block diagram consists of ${device.blockDiagram.length} stages:\n\n${device.blockDiagram.map((b, i) => `${i + 1}. **${b.label}**: ${b.description}`).join('\n\n')}\n\nVisit the Block Diagram module to interact with each block.`;
    }

    if (q.includes('learning path') || q.includes('where to start') || q.includes('recommend')) {
      return `Here's a recommended learning path for the ${device.name}:\n\n1. Start with **Introduction** to understand the overview and clinical importance\n2. Study the **Working Principle** to learn how the device operates\n3. Explore **Components** to understand the hardware\n4. Review the **Block Diagram** to trace the signal flow\n5. Learn **Maintenance** procedures\n6. Practice **Troubleshooting** scenarios\n7. Test yourself with **Viva Questions** and the **MCQ Quiz**\n8. Apply everything in the **Virtual Laboratory**\n\nComplete all modules to earn a certificate!`;
    }

    if (q.includes('advantage') || q.includes('benefit')) {
      return `Advantages of the ${device.name}:\n\n${device.introduction.advantages.map((a) => `• ${a}`).join('\n')}`;
    }

    if (q.includes('limitation') || q.includes('disadvantage') || q.includes('drawback')) {
      return `Limitations of the ${device.name}:\n\n${device.introduction.limitations.map((l) => `• ${l}`).join('\n')}`;
    }

    return `Great question about the ${device.name}! Here's what I can tell you:\n\n${device.introduction.overview}\n\nI can help you with:\n• Working principles and signal flow\n• Component descriptions and functions\n• Troubleshooting scenarios\n• Maintenance procedures\n• Viva questions\n• Learning path recommendations\n• Device comparisons\n\nTry asking about any of these topics!`;
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userMessage = input.trim();
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = generateResponse(userMessage);
      setMessages((prev) => [...prev, { role: 'assistant', content: response }]);
      setIsTyping(false);
    }, 600 + Math.random() * 400);
  };

  const suggestedQuestions = [
    'How does it work?',
    'What are the key components?',
    'Common troubleshooting scenarios?',
    'Generate a viva question',
    'Recommend a learning path',
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-900">AI Medical Assistant</h2>
          <p className="text-xs text-slate-500">Context-aware tutor for {device.name}</p>
        </div>
      </div>

      {/* Chat area */}
      <div ref={scrollRef} className="h-[400px] overflow-y-auto scrollbar-thin space-y-4 bg-slate-50 rounded-2xl p-4 border border-slate-100">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
              msg.role === 'user' ? 'bg-slate-200' : 'bg-gradient-to-br from-violet-500 to-purple-500'
            }`}>
              {msg.role === 'user' ? <User className="w-4 h-4 text-slate-600" /> : <Bot className="w-4 h-4 text-white" />}
            </div>
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
              msg.role === 'user' ? 'bg-primary-600 text-white' : 'bg-white border border-slate-200 text-slate-700'
            }`}>
              <p className="text-sm leading-relaxed whitespace-pre-line">{msg.content}</p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Suggested questions */}
      {messages.length <= 1 && (
        <div className="flex flex-wrap gap-2">
          {suggestedQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => { setInput(q); }}
              className="text-xs px-3 py-1.5 rounded-lg bg-violet-50 text-violet-700 border border-violet-200 hover:bg-violet-100 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask about the device..."
          className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all text-sm"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className="bg-gradient-to-r from-violet-500 to-purple-500 text-white p-3 rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
