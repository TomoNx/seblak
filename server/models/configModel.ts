import { dbRun, dbAll, dbGet } from "../db/manager";

export async function getConfig(key: string): Promise<any | null> {
  const row = await dbGet(`SELECT value FROM kv_store WHERE key = ?`, [key]);
  return row ? JSON.parse(row.value as string) : null;
}

export async function getAllConfigs(): Promise<Record<string, any>> {
  const rows = await dbAll(`SELECT * FROM kv_store`);
  const configMap: Record<string, any> = {};
  rows.forEach((r: any) => {
    configMap[r.key] = JSON.parse(r.value as string);
  });
  return configMap;
}

export async function saveConfig(key: string, data: any): Promise<void> {
  await dbRun(
    `INSERT INTO kv_store (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
    [key, JSON.stringify(data)]
  );
}

export async function resetConfigs(): Promise<void> {
  await dbRun(`DELETE FROM kv_store`);
}
