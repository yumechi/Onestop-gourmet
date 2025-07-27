// deno run --allow-read --allow-write --allow-net --allow-env .github/scripts/stats-workflow.ts
// 統合された章ファイルカウント・追跡・通知ワークフロー

/**
 * vivliostyle.config.jsから章ファイル数を取得
 */
async function countChapterFiles(): Promise<number> {
  try {
    const configPath = new URL('../../vivliostyle.config.js', import.meta.url);
    const config = await import(configPath.href);

    const entries = config.default.entry || [];
    const chapterFiles = entries.filter((entry: string | object) => {
      return typeof entry === 'string' && entry.startsWith('chap-') && entry.endsWith('.md');
    });

    console.log(`Found chapter files: ${chapterFiles.join(', ')}`);
    return chapterFiles.length;
  } catch (error) {
    console.error('Error reading vivliostyle.config.js:', error);
    throw error;
  }
}

/**
 * 前回の章ファイル数を取得
 */
async function getPreviousCount(): Promise<number> {
  try {
    const statsLogContent = await Deno.readTextFile('.github/stats.log');
    const prevCount = parseInt(statsLogContent.trim());
    return isNaN(prevCount) ? 0 : prevCount;
  } catch (error) {
    console.log('No previous stats.log found, using 0 as previous count');
    return 0;
  }
}

/**
 * stats.logファイルを更新
 */
async function updateStatsLog(count: number): Promise<void> {
  try {
    await Deno.writeTextFile('.github/stats.log', count.toString());
    console.log(`Updated stats.log with count: ${count}`);
  } catch (error) {
    console.error('Error updating stats.log:', error);
    throw error;
  }
}

/**
 * Slack通知メッセージを構築
 */
function buildSlackMessage(prevCount: number, currentCount: number) {
  const diff = currentCount - prevCount;
  const diffMessage = diff > 0 ? `（前日比 +${diff}）` : '';

  return {
    "blocks": [
      {
        "type": "context",
        "elements": [
          {
            "type": "mrkdwn",
            "text": `『<https://github.com/onestop-techbook/Onestop-gourmet|ワンストップ食>』の執筆状況: 現在 *${currentCount}* 章 ${diffMessage} :books: <https://oyakata-techbook.slack.com/canvas/CDS3UGG75|執筆の手引き>`
          }
        ]
      },
      {
        "type": "context",
        "elements": [
          {
            "type": "plain_text",
            "text": `${':page_with_curl:'.repeat(currentCount - diff)}${':new:'.repeat(diff)}`,
            "emoji": true
          }
        ]
      }
    ]
  };
}

/**
 * Slack通知を送信
 */
async function sendSlackNotification(prevCount: number, currentCount: number): Promise<void> {
  const webhookUrl = Deno.env.get("SLACK_WEBHOOK_URL");
  if (!webhookUrl) {
    console.error("SLACK_WEBHOOK_URL is not set.");
    throw new Error("SLACK_WEBHOOK_URL is not set");
  }

  const message = buildSlackMessage(prevCount, currentCount);

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to send Slack notification:", errorText);
      throw new Error(`Slack notification failed: ${response.status}`);
    }

    console.log("Slack notification sent successfully");
  } catch (error) {
    console.error("Error sending Slack notification:", error);
    throw error;
  }
}


/**
 * メイン処理
 */
async function main(): Promise<void> {
  try {
    console.log("Starting chapter count workflow...");

    // 現在の章ファイル数を取得
    const currentCount = await countChapterFiles();
    console.log(`Current chapter count: ${currentCount}`);

    // 前回の章ファイル数を取得
    const previousCount = await getPreviousCount();
    console.log(`Previous chapter count: ${previousCount}`);

    // 章数に変化がある場合のみ通知
    if (currentCount !== previousCount) {
      // stats.logを更新
      await updateStatsLog(currentCount);

      if (currentCount < previousCount) {
        console.log("章数が減少しているため、通知をスキップします");
        return;
      }

      console.log("Chapter count changed, sending notification...");
      await sendSlackNotification(previousCount, currentCount);
    } else {
      console.log("No change in chapter count, skipping notification");
    }

    console.log("Workflow completed successfully");
  } catch (error) {
    console.error("Workflow failed:", error);
    Deno.exit(1);
  }
}

// 実行
await main();