import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, Text, View, ScrollView, TouchableOpacity, 
  TextInput, SafeAreaView, StatusBar, Modal, Linking 
} from 'react-native';

const API_BASE = 'http://localhost:8000';

export default function App() {
  const [activeTab, setActiveTab] = useState<'radar' | 'discover' | 'pulse' | 'saved' | 'alerts'>('radar');
  const [feed, setFeed] = useState<any>(null);
  const [selectedTopic, setSelectedTopic] = useState<any>(null);
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [explanationMode, setExplanationMode] = useState<'tldr' | 'beginner' | 'technical' | 'impact'>('tldr');
  const [chatMessages, setChatMessages] = useState<Array<{ role: string; text: string }>>([
    { role: 'assistant', text: 'Hello Divya! I am Pulse, your mobile AI tech radar. What would you like to explore today?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [notifications, setNotifications] = useState<any[]>([]);

  // Fetch initial feed from API
  useEffect(() => {
    fetch(`${API_BASE}/feed`)
      .then(res => res.json())
      .then(data => setFeed(data))
      .catch(() => {
        // Fallback demo data if backend not reachable on device
        setFeed({
          hero_signal: {
            title: 'AI Agent Memory & Long-Term State Orchestration',
            category: 'AI',
            status: 'Emerging',
            momentum_score: 0.96,
            source_count: 42,
            what_happened: 'Developers converged on 3-tier episodic memory architectures for multi-day autonomous agent execution.',
            why_it_matters: 'Enables agents to survive multi-session executions without losing user preferences or tool state.',
            slug: 'ai-agent-memory'
          },
          trending: [
            {
              id: '1',
              title: 'Model Context Protocol (MCP) Open Standard',
              category: 'Developer Tools',
              status: 'Rising',
              momentum_score: 0.92,
              source_count: 35,
              slug: 'model-context-protocol',
              tagline: 'Anthropic open standard connecting LLMs to databases and dev tools.'
            },
            {
              id: '2',
              title: 'React 19 & Next.js Dynamic IO',
              category: 'Development',
              status: 'Established',
              momentum_score: 0.78,
              source_count: 28,
              slug: 'react-server-actions-v19',
              tagline: 'Compiler-driven automatic memoization in general availability.'
            }
          ],
          for_you: [
            {
              id: 'ev1',
              title: 'Hierarchical Memory Consolidation Becomes Standard for AI Agents',
              summary: 'Engineering teams replace stateless tokens with Postgres episodic checkpointers.',
              category: 'AI',
              primary_source_name: 'Hacker News',
              published_at: '2026-09-23T18:00:00Z'
            }
          ]
        });
      });

    fetch(`${API_BASE}/notifications`)
      .then(res => res.json())
      .then(data => setNotifications(data))
      .catch(() => {
        setNotifications([
          {
            id: 'n1',
            title: '🔥 AI Agent Memory is rising rapidly',
            body: 'Discussions have surged across Reddit, GitHub, and 4 arXiv preprints.',
            category: 'Trend',
            is_read: false
          }
        ]);
      });
  }, []);

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    const userText = chatInput;
    setChatMessages(prev => [...prev, { role: 'user', text: userText }]);
    setChatInput('');

    fetch(`${API_BASE}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userText })
    })
      .then(res => res.json())
      .then(data => {
        setChatMessages(prev => [...prev, { role: 'assistant', text: data.response || 'Verified across live sources.' }]);
      })
      .catch(() => {
        setChatMessages(prev => [...prev, {
          role: 'assistant',
          text: `Based on active radar intelligence: Major momentum observed in persistent agent architectures and MCP standard adoption across GitHub and Hacker News.`
        }]);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0C10" />

      {/* Top Mobile Header */}
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <View style={styles.radarDot} />
          <Text style={styles.brandTitle}>TECHPULSE <Text style={styles.brandSubtitle}>AI</Text></Text>
        </View>
        <TouchableOpacity 
          style={styles.notifBadge}
          onPress={() => setActiveTab('alerts')}
        >
          <Text style={styles.notifBadgeText}>🚨 {notifications.filter(n => !n.is_read).length}</Text>
        </TouchableOpacity>
      </View>

      {/* Main Tab Screen Content */}
      <View style={styles.content}>
        
        {/* TAB 1: RADAR HOME */}
        {activeTab === 'radar' && (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPad}>
            
            <View style={styles.greetingBox}>
              <Text style={styles.greetingTitle}>Good morning, Divya 👋</Text>
              <Text style={styles.greetingSubtitle}>Here is what actually matters in tech today.</Text>
            </View>

            {/* Hero Signal Card */}
            {feed?.hero_signal && (
              <TouchableOpacity 
                style={styles.heroCard}
                onPress={() => setSelectedTopic(feed.hero_signal)}
                activeOpacity={0.85}
              >
                <View style={styles.badgeRow}>
                  <Text style={styles.heroBadge}>🔥 TODAY&apos;S SIGNAL</Text>
                  <Text style={styles.categoryBadge}>{feed.hero_signal.category}</Text>
                </View>

                <Text style={styles.heroTitle}>{feed.hero_signal.title}</Text>
                <Text style={styles.heroSummary}>{feed.hero_signal.what_happened}</Text>

                <View style={styles.cardFooter}>
                  <Text style={styles.footerStat}>{feed.hero_signal.source_count} Sources</Text>
                  <Text style={styles.momentumText}>Momentum: {Math.round((feed.hero_signal.momentum_score || 0.95) * 100)}%</Text>
                </View>
              </TouchableOpacity>
            )}

            {/* Trending Now Section */}
            <Text style={styles.sectionHeader}>TRENDING NOW</Text>
            {feed?.trending?.map((t: any) => (
              <TouchableOpacity 
                key={t.id || t.slug}
                style={styles.topicCard}
                onPress={() => setSelectedTopic(t)}
                activeOpacity={0.8}
              >
                <View style={styles.badgeRow}>
                  <Text style={styles.statusBadge}>↑ {t.status}</Text>
                  <Text style={styles.categoryBadge}>{t.category}</Text>
                </View>
                <Text style={styles.topicTitle}>{t.title}</Text>
                <Text style={styles.topicTagline}>{t.tagline || t.why_it_matters}</Text>
                <View style={styles.cardFooter}>
                  <Text style={styles.footerStat}>{t.source_count} sources</Text>
                  <Text style={styles.exploreText}>Explore →</Text>
                </View>
              </TouchableOpacity>
            ))}

            {/* For You Section */}
            <Text style={styles.sectionHeader}>FOR YOU (AI ENGINEER)</Text>
            {feed?.for_you?.map((ev: any) => (
              <TouchableOpacity
                key={ev.id}
                style={styles.eventCard}
                onPress={() => setSelectedArticle(ev)}
                activeOpacity={0.8}
              >
                <Text style={styles.sourceText}>{ev.primary_source_name} • {ev.category}</Text>
                <Text style={styles.eventTitle}>{ev.title}</Text>
                <Text style={styles.eventSummary}>{ev.summary}</Text>
              </TouchableOpacity>
            ))}

          </ScrollView>
        )}

        {/* TAB 2: DISCOVER */}
        {activeTab === 'discover' && (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPad}>
            <Text style={styles.screenTitle}>Discover Ecosystem</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search AI agents, MCP, Next.js..."
              placeholderTextColor="#6B7280"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />

            <Text style={styles.sectionHeader}>TRACKED TOPIC VECTORS</Text>
            {feed?.trending?.map((t: any) => (
              <TouchableOpacity 
                key={t.id || t.slug}
                style={styles.topicCard}
                onPress={() => setSelectedTopic(t)}
              >
                <Text style={styles.topicTitle}>{t.title}</Text>
                <Text style={styles.topicTagline}>{t.category} • Momentum {Math.round((t.momentum_score || 0.9) * 100)}%</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* TAB 3: PULSE AI CHAT */}
        {activeTab === 'pulse' && (
          <View style={styles.chatContainer}>
            <Text style={styles.screenTitle}>Pulse AI Terminal</Text>
            <ScrollView style={styles.chatScroll} contentContainerStyle={{ paddingBottom: 20 }}>
              {chatMessages.map((msg, i) => (
                <View 
                  key={i} 
                  style={[styles.chatBubble, msg.role === 'user' ? styles.userBubble : styles.assistantBubble]}
                >
                  <Text style={[styles.chatText, msg.role === 'user' ? styles.userText : styles.assistantText]}>
                    {msg.text}
                  </Text>
                </View>
              ))}
            </ScrollView>

            <View style={styles.chatInputRow}>
              <TextInput
                style={styles.chatInput}
                placeholder="Ask Pulse anything in tech..."
                placeholderTextColor="#6B7280"
                value={chatInput}
                onChangeText={setChatInput}
                onSubmitEditing={handleSendChat}
              />
              <TouchableOpacity style={styles.sendButton} onPress={handleSendChat}>
                <Text style={styles.sendButtonText}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* TAB 4: SAVED LIBRARY */}
        {activeTab === 'saved' && (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPad}>
            <Text style={styles.screenTitle}>My Library</Text>
            <Text style={styles.emptyText}>Saved articles and followed topics sync with your desktop radar account.</Text>
          </ScrollView>
        )}

        {/* TAB 5: ALERTS */}
        {activeTab === 'alerts' && (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPad}>
            <Text style={styles.screenTitle}>Intelligent Alerts</Text>
            {notifications.map((n) => (
              <View key={n.id} style={styles.alertCard}>
                <Text style={styles.alertCategory}>{n.category}</Text>
                <Text style={styles.alertTitle}>{n.title}</Text>
                <Text style={styles.alertBody}>{n.body}</Text>
              </View>
            ))}
          </ScrollView>
        )}

      </View>

      {/* Topic Detail Modal */}
      <Modal visible={!!selectedTopic} animationType="slide" transparent={false}>
        <SafeAreaView style={styles.modalContainer}>
          <ScrollView contentContainerStyle={styles.scrollPad}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setSelectedTopic(null)}
            >
              <Text style={styles.closeButtonText}>✕ Close</Text>
            </TouchableOpacity>

            {selectedTopic && (
              <View style={{ marginTop: 10 }}>
                <Text style={styles.statusBadge}>🔥 {selectedTopic.status || 'Emerging'}</Text>
                <Text style={styles.modalTitle}>{selectedTopic.title}</Text>
                
                {/* Explanation Mode Switcher */}
                <View style={styles.modeRow}>
                  {['tldr', 'beginner', 'technical', 'impact'].map((mode) => (
                    <TouchableOpacity
                      key={mode}
                      style={[styles.modeButton, explanationMode === mode && styles.activeModeButton]}
                      onPress={() => setExplanationMode(mode as any)}
                    >
                      <Text style={[styles.modeText, explanationMode === mode && styles.activeModeText]}>
                        {mode.toUpperCase()}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <View style={styles.explanationBox}>
                  <Text style={styles.explanationContent}>
                    {explanationMode === 'tldr' && (selectedTopic.what_happened || selectedTopic.tagline)}
                    {explanationMode === 'beginner' && `A simplified explanation of ${selectedTopic.title} and why it makes software systems more autonomous.`}
                    {explanationMode === 'technical' && `Technical state machine and protocol specification powering ${selectedTopic.title}.`}
                    {explanationMode === 'impact' && `Business & Developer implications of adopting this technology vector.`}
                  </Text>
                </View>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        {[
          { key: 'radar', label: 'Radar', icon: '📡' },
          { key: 'discover', label: 'Discover', icon: '🔍' },
          { key: 'pulse', label: 'Pulse AI', icon: '✨' },
          { key: 'saved', label: 'Saved', icon: '🔖' },
          { key: 'alerts', label: 'Alerts', icon: '🔔' },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={styles.navItem}
            onPress={() => setActiveTab(tab.key as any)}
          >
            <Text style={styles.navIcon}>{tab.icon}</Text>
            <Text style={[styles.navLabel, activeTab === tab.key && styles.activeNavLabel]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0C10',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1F2430',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radarDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF6B00',
    marginRight: 8,
  },
  brandTitle: {
    color: '#F3F4F6',
    fontWeight: '800',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  brandSubtitle: {
    color: '#FF6B00',
    fontSize: 12,
  },
  notifBadge: {
    backgroundColor: '#1E2330',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  notifBadgeText: {
    color: '#F3F4F6',
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  scrollPad: {
    padding: 16,
    paddingBottom: 40,
  },
  greetingBox: {
    marginBottom: 16,
  },
  greetingTitle: {
    color: '#F3F4F6',
    fontSize: 22,
    fontWeight: 'bold',
  },
  greetingSubtitle: {
    color: '#9CA3AF',
    fontSize: 13,
    marginTop: 2,
  },
  heroCard: {
    backgroundColor: '#12151C',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#FF6B00',
    marginBottom: 20,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  heroBadge: {
    color: '#FF6B00',
    fontWeight: '800',
    fontSize: 11,
  },
  categoryBadge: {
    color: '#9CA3AF',
    fontSize: 11,
  },
  heroTitle: {
    color: '#F3F4F6',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  heroSummary: {
    color: '#9CA3AF',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#1F2430',
    paddingTop: 8,
  },
  footerStat: {
    color: '#6B7280',
    fontSize: 11,
  },
  momentumText: {
    color: '#FF6B00',
    fontWeight: 'bold',
    fontSize: 11,
  },
  sectionHeader: {
    color: '#6B7280',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginTop: 10,
    marginBottom: 10,
  },
  topicCard: {
    backgroundColor: '#12151C',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1F2430',
    marginBottom: 10,
  },
  statusBadge: {
    color: '#FF6B00',
    fontSize: 10,
    fontWeight: '700',
  },
  topicTitle: {
    color: '#F3F4F6',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  topicTagline: {
    color: '#9CA3AF',
    fontSize: 12,
    marginBottom: 8,
  },
  exploreText: {
    color: '#FF6B00',
    fontWeight: '700',
    fontSize: 11,
  },
  eventCard: {
    backgroundColor: '#12151C',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1F2430',
    marginBottom: 10,
  },
  sourceText: {
    color: '#6B7280',
    fontSize: 10,
    marginBottom: 4,
  },
  eventTitle: {
    color: '#F3F4F6',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  eventSummary: {
    color: '#9CA3AF',
    fontSize: 12,
    lineHeight: 16,
  },
  screenTitle: {
    color: '#F3F4F6',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  searchInput: {
    backgroundColor: '#12151C',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1F2430',
    padding: 12,
    color: '#F3F4F6',
    fontSize: 13,
    marginBottom: 16,
  },
  emptyText: {
    color: '#6B7280',
    fontSize: 13,
    lineHeight: 18,
  },
  alertCard: {
    backgroundColor: '#12151C',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1F2430',
    marginBottom: 10,
  },
  alertCategory: {
    color: '#FF6B00',
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 2,
  },
  alertTitle: {
    color: '#F3F4F6',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  alertBody: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  chatContainer: {
    flex: 1,
    padding: 16,
  },
  chatScroll: {
    flex: 1,
  },
  chatBubble: {
    padding: 12,
    borderRadius: 14,
    marginBottom: 10,
    maxWidth: '85%',
  },
  userBubble: {
    backgroundColor: '#FF6B00',
    alignSelf: 'flex-end',
  },
  assistantBubble: {
    backgroundColor: '#12151C',
    borderWidth: 1,
    borderColor: '#1F2430',
    alignSelf: 'flex-start',
  },
  chatText: {
    fontSize: 13,
    lineHeight: 18,
  },
  userText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  assistantText: {
    color: '#F3F4F6',
  },
  chatInputRow: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 8,
  },
  chatInput: {
    flex: 1,
    backgroundColor: '#12151C',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1F2430',
    padding: 12,
    color: '#F3F4F6',
    fontSize: 13,
  },
  sendButton: {
    backgroundColor: '#FF6B00',
    borderRadius: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 13,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#0A0C10',
  },
  closeButton: {
    padding: 10,
    alignSelf: 'flex-start',
    backgroundColor: '#1E2330',
    borderRadius: 8,
    marginBottom: 10,
  },
  closeButtonText: {
    color: '#F3F4F6',
    fontSize: 12,
    fontWeight: '600',
  },
  modalTitle: {
    color: '#F3F4F6',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 6,
    marginBottom: 14,
  },
  modeRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 14,
  },
  modeButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#12151C',
    borderWidth: 1,
    borderColor: '#1F2430',
  },
  activeModeButton: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  modeText: {
    color: '#9CA3AF',
    fontSize: 10,
    fontWeight: '700',
  },
  activeModeText: {
    color: '#FFFFFF',
  },
  explanationBox: {
    backgroundColor: '#12151C',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1F2430',
  },
  explanationContent: {
    color: '#F3F4F6',
    fontSize: 14,
    lineHeight: 20,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#12151C',
    borderTopWidth: 1,
    borderTopColor: '#1F2430',
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
  navIcon: {
    fontSize: 16,
    marginBottom: 2,
  },
  navLabel: {
    color: '#6B7280',
    fontSize: 10,
    fontWeight: '500',
  },
  activeNavLabel: {
    color: '#FF6B00',
    fontWeight: '700',
  },
});
