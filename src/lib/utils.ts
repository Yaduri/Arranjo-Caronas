export * from "./shared-utils";
import { prisma } from "./prisma";

export async function getTemplate(key: string, defaultValue: string) {
  const config = await prisma.appSetting.findUnique({
    where: { key }
  });
  return config?.value || defaultValue;
}
