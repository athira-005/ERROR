import { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, User, Bot, Search } from 'lucide-react';
import { allDevices } from '../data';
import { categories } from '../data/categories';
import { navigate } from '../hooks/useRouter';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello! I'm the BioMed AI Tutor. I can help you with:\n\n• Explaining medical device concepts\n• Comparing devices across categories\n• Generating viva questions\n• Providing troubleshooting guidance\n• Recommending learning paths\n\nAsk me anything about any of the 50+ medical devices in BioMedVerse!",
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const generateResponse = (question: string): string => {
    const q = question.toLowerCase();

    // Find relevant devices
    const matchedDevices = allDevices.filter((d) =>
      d.name.toLowerCase().includes(q) ||
      d.tagline.toLowerCase().includes(q) ||
      d.description.toLowerCase().includes(q)
    );

    if (q.includes('recommend') || q.includes('learning path') || q.includes('where should i start') || q.includes('what should i learn')) {
      const beginnerDevices = allDevices.filter((d) => d.difficulty === 'Beginner');
      return `Here's a recommended learning path for Biomedical Engineering students:\n\n**Phase 1 — Foundations (Beginner devices):**\n${beginnerDevices.slice(0, 5).map((d, i) => `${i + 1}. ${d.name} — ${d.tagline}`).join('\n')}\n\n**Phase 2 — Intermediate:**\n${allDevices.filter(d => d.difficulty === 'Intermediate').slice(0, 5).map((d, i) => `${i + 1}. ${d.name}`).join('\n')}\n\n**Phase 3 — Advanced:**\n${allDevices.filter(d => d.difficulty === 'Advanced').slice(0, 5).map((d, i) => `${i + 1}. ${d.name}`).join('\n')}\n\nStart with the Patient Monitoring category as it covers fundamental concepts used across all other devices.`;
    }

    if (q.includes('compare') && matchedDevices.length >= 2) {
      const [d1, d2] = matchedDevices;
      return `**Comparing ${d1.name} vs ${d2.name}:**\n\n**${d1.name}:**\n• ${d1.introduction.overview.substring(0, 150)}...\n• Advantages: ${d1.introduction.advantages.slice(0, 2).join(', ')}\n• Limitations: ${d1.introduction.limitations.slice(0, 2).join(', ')}\n\n**${d2.name}:**\n• ${d2.introduction.overview.substring(0, 150)}...\n• Advantages: ${d2.introduction.advantages.slice(0, 2).join(', ')}\n• Limitations: ${d2.introduction.limitations.slice(0, 2).join(', ')}\n\nWould you like a deeper comparison of any specific aspect?`;
    }

    if (q.includes('compare') || q.includes('difference between')) {
      return `I can help you compare devices! Try asking:\n\n• "Compare ECG Machine and EEG Machine"\n• "What's the difference between Ventilator and CPAP Machine?"\n• "Compare X-Ray and MRI"\n\nOr browse the device library to explore devices side by side.`;
    }

    if (q.includes('viva') || q.includes('exam question') || q.includes('practice question')) {
      const randomDevice = allDevices[Math.floor(Math.random() * allDevices.length)];
      const randomQ = randomDevice.vivaQuestions[Math.floor(Math.random() * randomDevice.vivaQuestions.length)];
      return `Here's a practice viva question:\n\n**Device:** ${randomDevice.name}\n**Q: ${randomQ.question}**\n\nThink about your answer, then visit the ${randomDevice.name} device page to check the model answer. Would you like another question?`;
    }

    if (q.includes('category') || q.includes('categories') || q.includes('domains')) {
      return `BioMedVerse covers ${categories.length} biomedical engineering categories:\n\n${categories.map((c, i) => `${i + 1}. **${c.name}** — ${c.description}`).join('\n\n')}\n\nEach category contains multiple devices with full interactive labs. Which category interests you?`;
    }

    if (q.includes('how many') && q.includes('device')) {
      return `BioMedVerse currently has **${allDevices.length} medical devices** across ${categories.length} categories. Each device includes 9 interactive modules:\n\n1. Introduction\n2. Working Principle\n3. Component Explorer\n4. Block Diagram\n5. Maintenance\n6. Troubleshooting\n7. Viva Questions\n8. MCQ Quiz\n9. Virtual Laboratory\n\nThat's ${allDevices.length * 9} total learning modules!`;
    }

    if (q.includes('troubleshoot') || q.includes('fault')) {
      if (selectedDevice) {
        const device = allDevices.find((d) => d.id === selectedDevice);
        if (device) {
          return `Troubleshooting guidance for ${device.name}:\n\n${device.troubleshooting.map((t: any, i: number) => `**${i + 1}. ${t.scenario}**\nSymptom: ${t.symptom}\nSolution: ${t.solution}`).join('\n\n')}\n\nPractice these in the Virtual Laboratory!`;
        }
      }
      return `I can provide troubleshooting guidance for any device. Select a device from the dropdown above, or ask about a specific device like "troubleshooting for ECG Machine" or "ventilator faults".`;
    }

    if (matchedDevices.length > 0) {
      const device = matchedDevices[0];
      return `**${device.name}**\n\n${device.introduction.overview}\n\n**Clinical Importance:** ${device.introduction.clinicalImportance}\n\n**Applications:**\n${device.introduction.applications.slice(0, 4).map((a: string) => `• ${a}`).join('\n')}\n\nYou can explore this device in detail at the ${device.name} page, or ask me about its working principle, components, or troubleshooting.`;
    }

    return `I'm here to help with biomedical engineering topics! You can ask me about:\n\n• Any of the ${allDevices.length} medical devices in BioMedVerse\n• How a specific device works\n• Device comparisons\n• Troubleshooting guidance\n• Viva questions for practice\n• Learning path recommendations\n• Category overviews\n\nTry asking: "How does an MRI work?" or "Recommend a learning path" or "Compare ECG and EEG"`;
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
    'Recommend a learning path',
    'How many devices are there?',
    'What categories are available?',
    'Generate a viva question',
    'Compare ECG and EEG',
  ];

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-slate-900">BioMed AI Tutor</h1>
            <p className="text-slate-600">Your AI-powered biomedical engineering assistant</p>
          </div>
        </div>

        {/* Device context selector */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select
              value={selectedDevice}
              onChange={(e) => setSelectedDevice(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-400"
            >
              <option value="">All devices (general mode)</option>
              {categories.map((cat) => (
                <optgroup key={cat.id} label={cat.name}>
                  {allDevices.filter((d) => d.categoryId === cat.id).map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
        </div>

        {/* Chat area */}
        <div className="card p-4">
          <div ref={scrollRef} className="h-[450px] overflow-y-auto scrollbar-thin space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  msg.role === 'user' ? 'bg-slate-200' : 'bg-gradient-to-br from-violet-500 to-purple-500'
                }`}>
                  {msg.role === 'user' ? <User className="w-4 h-4 text-slate-600" /> : <Bot className="w-4 h-4 text-white" />}
                </div>
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  msg.role === 'user' ? 'bg-primary-600 text-white' : 'bg-slate-50 border border-slate-200 text-slate-700'
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
                <div className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3">
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
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100">
              {suggestedQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => setInput(q)}
                  className="text-xs px-3 py-1.5 rounded-lg bg-violet-50 text-violet-700 border border-violet-200 hover:bg-violet-100 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about any medical device or concept..."
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

        {/* Quick links */}
        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          <button onClick={() => navigate('/library')} className="text-sm text-slate-500 hover:text-primary-600 transition-colors">
            Browse Device Library →
          </button>
          <button onClick={() => navigate('/dashboard')} className="text-sm text-slate-500 hover:text-primary-600 transition-colors">
            View Dashboard →
          </button>
        </div>
      </div>
    </div>
  );
}
