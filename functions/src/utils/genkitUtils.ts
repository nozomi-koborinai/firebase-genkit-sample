import { db } from '../config/firebase'

export async function isGenkitEnabled(): Promise<boolean> {
  const appConfDoc = await db.collection(`appConf`).doc(`config`).get()
  return appConfDoc.data()?.genkitEnabled ?? false
}
