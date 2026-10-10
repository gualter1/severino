import { grillScheduler } from "./grill-scheduler.js";

async function testGrillScheduler() {
  console.log("🔥 Testing Grill Me Scheduler...");
  
  await grillScheduler.initialize();
  
  // Test manual grill session
  const session = await grillScheduler.runGrillNow("Teste de alinhamento inicial");
  console.log("Session:", session.id, session.status);
  console.log("Summary:", session.summary);
  console.log("Insights:", session.insights);
  console.log("Action Items:", session.actionItems);
  
  // Test listing
  const sessions = grillScheduler.listSessions();
  console.log(`Total sessions: ${sessions.length}`);
  
  console.log("✅ Grill Scheduler test passed!");
}

testGrillScheduler().catch(console.error);
