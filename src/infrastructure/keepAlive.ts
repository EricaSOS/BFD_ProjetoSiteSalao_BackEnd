import cron from "node-cron";

const keepAliveEnabled = process.env.KEEP_ALIVE_ENABLED === "true";
const keepAliveUrl = process.env.KEEP_ALIVE_URL;
const interval = process.env.KEEP_ALIVE_INTERVAL || "4";
const startHour = process.env.KEEP_ALIVE_START || "6";
const endHour = process.env.KEEP_ALIVE_END || "22";
const weekdays = process.env.KEEP_ALIVE_WEEKDAYS || "1-6";
const timezone = process.env.KEEP_ALIVE_TIMEZONE || "America/Belem";

if (keepAliveEnabled && keepAliveUrl) {
  const cronExpression = `*/${interval} ${startHour}-${Number(endHour) - 1} * * ${weekdays}`;

  cron.schedule(
    cronExpression,
    async () => {
      try {
        const response = await fetch(`${keepAliveUrl}/healthz`);

        console.log(
          `[KeepAlive] Ping enviado. Status: ${response.status}`
        );
      } catch (error) {
        console.error("[KeepAlive] Erro ao enviar ping:", error);
      }
    },
    {
      timezone
    }
  );

  console.log(`[KeepAlive] Ativo com cron: ${cronExpression}`);
} else {
  console.log("[KeepAlive] Desativado.");
}