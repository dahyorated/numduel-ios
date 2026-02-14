#!/usr/bin/env node
/**
 * User test: verifies all new features are present and wired in www/index.html.
 * Run: node test-new-features.js
 */
const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'www', 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8');

let passed = 0;
let failed = 0;

function ok(name, condition) {
  if (condition) {
    console.log('  ✓', name);
    passed++;
    return true;
  } else {
    console.log('  ✗', name);
    failed++;
    return false;
  }
}

console.log('\n--- NUM DUEL: New features test ---\n');

// 1. "Make your own guess now" popup & beep
console.log('1. Reminder popup & beep (after giving feedback)');
ok('State: showMakeGuessReminder in S', html.includes('showMakeGuessReminder'));
ok('sendFb sets showMakeGuessReminder when game not over', html.includes('showMakeGuessReminder: !isGameOver'));
ok('sendFb calls playReminderBeep() when not game over', html.includes('playReminderBeep()') && html.includes('!isGameOver'));
ok('Reminder auto-hides after 2s', html.includes('showMakeGuessReminder: false') && html.includes('2000'));
ok('playReminderBeep function exists', html.includes('function playReminderBeep()'));
ok('Reminder popup UI (circular)', html.includes('reminder-circle') && html.includes('Make your own guess now'));
ok('restart() resets showMakeGuessReminder', html.includes('showMakeGuessReminder:false') && html.includes('restart'));
console.log('');

// 2. Chat tab & messages
console.log('2. Chat tab & messages');
ok('State: chatDraft and chatLastSeenCount', html.includes('chatDraft') && html.includes('chatLastSeenCount'));
ok('getMessages() helper', html.includes('function getMessages()'));
ok('sendChat() sends to G.messages', html.includes('function sendChat()') && html.includes('G.messages.push'));
ok('Chat tab button (third tab)', html.includes("'Chat'") && html.includes('tab-chat'));
ok('Chat list when tab=chat', html.includes("S.tab==='chat'") && html.includes('chat-list'));
ok('Chat message bubbles (mine/theirs)', html.includes('chat-msg') && html.includes('mine') && html.includes('theirs'));
ok('Chat input + Send', html.includes('Message...') && html.includes('sendChat'));
ok('chatDraft in TYPING_KEYS (no full re-render on type)', html.includes("'chatDraft'"));
ok('restart() resets chat state', html.includes('chatLastSeenCount:0') && html.includes('restart'));
console.log('');

// 3. Chat inbox sound when not on Chat tab
console.log('3. Chat inbox sound (when new message & not on Chat tab)');
ok('playChatInboxSound() function', html.includes('function playChatInboxSound()'));
ok('onGameUpdate: play sound when new msg from opponent and not on chat tab',
  html.includes('playChatInboxSound()') && html.includes('lastMsg.from !== S.role') && html.includes("S.tab === 'chat'") && html.includes('chatLastSeenCount = msgs.length'));
ok('Unread dot on Chat tab when unreadChat', html.includes('unreadChat') && html.includes("t3.appendChild(h('span',{className:'dot'}))"));
ok('Switching to Chat tab updates chatLastSeenCount', html.includes("tab:'chat',chatLastSeenCount:msgs.length"));
console.log('');

// 4. Integration: sendFb flow
console.log('4. sendFb → reminder flow');
const sendFbBlock = html.includes('isGameOver = G.status === \'finished\'') && 
  html.includes('showMakeGuessReminder: !isGameOver') &&
  html.includes('setTimeout(() => up({ showMakeGuessReminder: false }), 2000)');
ok('sendFb sets reminder and clears after 2s', sendFbBlock);
console.log('');

// Summary
console.log('---');
console.log(`Result: ${passed} passed, ${failed} failed`);
if (failed > 0) {
  process.exit(1);
}
console.log('All new feature checks passed.\n');
process.exit(0);
